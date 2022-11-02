
export function formatDate() {
    const date: Date = new Date();
    const formatDate: Date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds());
    return formatDate;
}

function padTo2Digits(num: number) {
    return num.toString().padStart(2, '0');
}

export function formatDateString(date: Date) {
    const newDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    return (
        [
            newDate.getFullYear(),
            padTo2Digits(newDate.getMonth() + 1),
            padTo2Digits(newDate.getDate() - 1),
        ].join('-') +
            'T'+
        [
            padTo2Digits(newDate.getHours()),
            padTo2Digits(newDate.getMinutes()),
            padTo2Digits(newDate.getSeconds()),
        ].join(':')
    );
}

export const sources = ["static", "lambda", "edge", "build", "external"];