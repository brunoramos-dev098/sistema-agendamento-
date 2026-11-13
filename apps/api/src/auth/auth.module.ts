import { PessoaDto } from "../common/dto.js";
import {
  Module,
  Global,
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Controller,
  Get,
  Post,
  Put,
  Body,
  Req,
  Res,
} from "@nestjs/common";
import { APP_GUARD, Reflector } from "@nestjs/core";
import { AuthService } from "./auth.service.js";
import { Public, Roles, AuthRequest, Perfil } from "./access.js";
import {
  LoginDto,
  RegistroDto,
  CriarAcessoDto,
  TrocarSenhaDto,
} from "./auth.dto.js";
export const cookieToken = (r: AuthRequest) =>
  r.headers.cookie
    ?.split(";")
    .map((v) => v.trim())
    .find((v) => v.startsWith("checkapp_session="))
    ?.slice(17);
type Response = { setHeader: (name: string, value: string) => void };
const cookie = (token: string) =>
  "checkapp_session=" +
  token +
  "; HttpOnly; SameSite=Strict; Path=/; Max-Age=" +
  (token ? "43200" : "0") +
  (process.env.NODE_ENV === "production" ? "; Secure" : "");
@Injectable()
class Guard implements CanActivate {
  constructor(
    private readonly auth: AuthService,
    private readonly reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<AuthRequest>();
    const unsafe = !["GET", "HEAD", "OPTIONS"].includes(req.method);
    const origins = [
      process.env.WEB_ORIGIN ?? "http://localhost:5173",
      ...(process.env.NODE_ENV !== "production"
        ? ["http://127.0.0.1:5173", "http://localhost:5173"]
        : []),
    ];
    if (
      unsafe &&
      ((req.headers.origin && !origins.includes(req.headers.origin)) ||
        (cookieToken(req) && !req.headers.origin))
    )
      throw new ForbiddenException("Origem da requisição não permitida");
    if (
      this.reflector.getAllAndOverride<boolean>("public", [
        context.getHandler(),
        context.getClass(),
      ])
    )
      return true;
    req.user = await this.auth.autenticar(cookieToken(req));
    const roles = this.reflector.getAllAndOverride<Perfil[]>("roles", [
      context.getHandler(),
      context.getClass(),
    ]);
    if (roles && !roles.includes(req.user.perfil))
      throw new ForbiddenException("Seu perfil não permite esta operação");
    return true;
  }
}
@Controller("auth")
class AuthController {
  constructor(private readonly auth: AuthService) {}
  @Public() @Get("health") health() {
    return { status: "ok" };
  }
  @Public() @Post("login") async login(
    @Req() r: AuthRequest,
    @Body() d: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    this.auth.limitar("login:" + r.ip);
    const token = await this.auth.login(d.email, d.senha);
    res.setHeader("Set-Cookie", cookie(token));
    return { message: "Login realizado" };
  }
  @Public() @Post("registro") async registro(
    @Req() r: AuthRequest,
    @Body() d: RegistroDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    this.auth.limitar("registro:" + r.ip);
    const token = await this.auth.registrar(d);
    res.setHeader("Set-Cookie", cookie(token));
    return { message: "Cadastro realizado" };
  }
  @Get("me") me(@Req() r: AuthRequest) {
    return this.auth.perfil(r.user);
  }
  @Post("logout") async sair(
    @Req() r: AuthRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.auth.sair(cookieToken(r));
    res.setHeader("Set-Cookie", cookie(""));
    return { message: "Sessão encerrada" };
  }
  @Roles("ADMINISTRADOR") @Get("contas") contas() {
    return this.auth.contas();
  }
  @Roles("ADMINISTRADOR") @Post("contas") criar(@Body() d: CriarAcessoDto) {
    return this.auth.criarAcesso(d);
  }
  @Put("perfil") perfil(@Req() r: AuthRequest, @Body() d: PessoaDto) {
    return this.auth.atualizarPerfil(r.user, d);
  }
  @Post("senha") senha(@Req() r: AuthRequest, @Body() d: TrocarSenhaDto) {
    return this.auth.trocarSenha(r.user, d.senhaAtual, d.novaSenha);
  }
}
@Global()
@Module({
  controllers: [AuthController],
  providers: [AuthService, { provide: APP_GUARD, useClass: Guard }],
  exports: [AuthService],
})
export class AuthModule {}
