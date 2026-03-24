import { fileURLToPath } from "url";
import { dirname } from "path";

export default function fileDirName(meta: string) : { __dirname: string, __filename: string} {
  const __filename = fileURLToPath(meta);
  const __dirname = dirname(__filename);
  return { __dirname, __filename}
}