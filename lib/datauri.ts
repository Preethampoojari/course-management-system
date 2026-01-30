import DatauriParser from "datauri/parser";
import path from "path";

type FileType = {
  originalname: string;
  buffer: Buffer;
};

const parser = new DatauriParser();

const getDataUri = (file: FileType): string => {
  const extName = path.extname(file.originalname);
  return parser.format(extName, file.buffer).content as string;
};

export default getDataUri;
