import fs from 'fs';
import path from 'path';

const FileLoaderUtils = {
    loadHtmlFile: async (fileName: string) => {
        return await fs.promises.readFile(path.join(process.cwd(), "/public/html", fileName), { 
            encoding: "utf8"
         });
    }
}

export default FileLoaderUtils