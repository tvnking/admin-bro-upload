"use strict";
// @flow
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFileInfo = void 0;
function getFileInfo(file, mime = '') {
    const pos = String(file.name).lastIndexOf('.');
    if (mime === 'image/jpeg') {
        const filename = `${String(file.name)
            .substr(0, pos < 0 ? String(file.name).length : pos)}.jpg`;
        return {
            filename,
            mime: 'image/jpeg'
        };
    }
    return {
        filename: file.name,
        mime: file.type,
    };
}
exports.getFileInfo = getFileInfo;
