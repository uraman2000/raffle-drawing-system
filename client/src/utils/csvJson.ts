import { stringify } from "querystring";

export const csvJSON = (csv: any) => {
  var lines = csv.split("\n");

  var result = [];

  var headers: any = lines[0].split(",");

  for (var i = 1; i < lines.length; i++) {
    var obj: any = {};
    var currentline = lines[i].split(",");

    for (var j = 0; j < headers.length; j++) {
      if (currentline[j] !== undefined || obj[headers[j]]) {
        const objectName = headers[j].replace(/\r/gm, "");
        obj[objectName] = currentline[j].replace(/\r/gm, "").replace(/"/g, "");
      }
    }

    result.push(obj);
  }

  //remove this if going to use for other proj
  result.forEach((newData: any) => {
    newData.accountNumber = Number(newData.accountNumber);
    newData.mobileNumber = Number(newData.mobileNumber);
    newData.ammountPaid = Number(newData.ammountPaid);
    newData.dateOfPayment = new Date(newData.dateOfPayment);
    newData.isValid = true;
    newData.numberOfEntries = 0;
    // newData.ammountPaid = Number(newData.ammountPaid);
  });

  return result; //JSON
  //   return JSON.stringify(result);
};

function lowercaseFirstLetter(string: string) {
  return string.charAt(0).toLowerCase() + string.slice(1);
}
