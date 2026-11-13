import ts from "typescript-eslint";
export default ts.config(
  { ignores: ["**/dist/**", "**/generated/**"] },
  ...ts.configs.recommended,
  { rules: { "@typescript-eslint/no-explicit-any": "error" } },
);
