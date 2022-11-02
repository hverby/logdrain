
export function formatDate() {
    const date: Date = new Date();
    const formatDate: Date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds());
    return formatDate;
}