
export class Cookies{

  static addCookie(name: string, value: string) {
    document.cookie = `${name}=${value}`
  }

  static getCookieMap():Map<string, string> {
    var cookies = document.cookie
    var pairs = cookies.split(";")

    var map = pairs.reduce((map: Map<string, string>, obj) => {
      var pair = obj.split("=");
      map.set(pair[0].trimStart(), pair[1]);
      return map;
    }, (new Map<string,string>()));

    return map;
  }

  static getCookie(name: string): string{
    let map = this.getCookieMap();
    return map.get(name) ?? "";
  }

  static clearCookie(name: string) {
    // Simply clear by setting expiration to a previous date
    document.cookie = name+"=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }

}