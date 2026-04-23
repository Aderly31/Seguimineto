function debugUserHeaders() {
  const sh = SpreadsheetApp.openById('1OpRmcCY4BEN8KeJUPiF1N5Uzex7I3OrR0EJesqfZGo0').getSheetByName('usuarios');
  const headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
  console.log(headers);
}
