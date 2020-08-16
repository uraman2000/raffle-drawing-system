export class Utils {
  static formatDate(dateStr: string) {
    const date = new Date(dateStr);
    if (date.getMonth()) {
      return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    }
    return "";
  }
}
