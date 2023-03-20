import FileSaver from 'file-saver';
import { surpriseMePrompts } from '../constants';


export function getRandomPrompt(prompt) {
    const randomIndex = Math.floor(Math.random() * surpriseMePrompts.length);
    const randomPropmpt = surpriseMePrompts[randomIndex];
    if (randomPropmpt === prompt) return getRandomPrompt(prompt);
    return randomPropmpt;
}


export async function downloadImage(id, photo) {
    FileSaver.saveAs(photo, `download-${id}.jpg`)
}