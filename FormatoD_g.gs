const DRIVE_FOLDER_ID_D = '1SywLPPOYXp8-FhN_RcWn-aNiS4mg6fSk';

function formatoD_get() {
  try {
    const data = SheetService.readObjects_(APP_CONFIG.SHEETS.CAPACITACIONES);
    return data.map(it => {
      let fechaSegura = '';
      if (it.fecha instanceof Date) {
        fechaSegura = Utilities.formatDate(it.fecha, Session.getScriptTimeZone(), 'yyyy-MM-dd');
      } else {
        fechaSegura = String(it.fecha || '');
      }

      return {
        id: String(it.id || ''), 
        nombre: String(it.nombre || ''), 
        fecha: fechaSegura,
        modalidad: String(it.modalidad || 'Virtual'), 
        participantes: Number(it.participantes || 0),
        codAei: it.codaei || '',
        progresoEvidencia: String(it.progresoEvidencia || ''),
        estado: String(it.estado || 'Programado'),
        imagen: it.imagen || it.imagenurl || ''
      };
    });
  } catch(err) {
    throw new Error("Error leyendo capacitaciones: " + err.message);
  }
}

function formatoD_save(data) {
  try {
    let fileUrl = '';
    if (data.fileData && data.fileData.base64) {
      fileUrl = uploadFileToDriveD_(data.fileData.base64, data.fileData.name, data.fileData.type);
    }

    const rowData = {
      id: data.id || Utilities.getUuid(),
      nombre: data.nombre,
      fecha: data.fecha,
      modalidad: data.modalidad,
      participantes: data.participantes,
      codaei: data.codAei,
      progresoEvidencia: data.progresoEvidencia || '',
      estado: data.estado || 'Programado',
      fechaCreacion: new Date()
    };

    if (fileUrl) {
      rowData.imagen = fileUrl;
    }
    
    if (data.id) return { success: SheetService.updateObjectById_(APP_CONFIG.SHEETS.CAPACITACIONES, data.id, rowData) };
    SheetService.saveObject_(APP_CONFIG.SHEETS.CAPACITACIONES, rowData); 
    return { success: true };
  } catch(e) { return { success: false, message: String(e) }; }
}

/**
 * Helper para subir archivos a Google Drive (Formato D)
 */
function uploadFileToDriveD_(base64, fileName, mimeType) {
  try {
    const folder = DriveApp.getFolderById(DRIVE_FOLDER_ID_D);
    const decoded = Utilities.base64Decode(base64);
    const blob = Utilities.newBlob(decoded, mimeType, fileName);
    const file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    return file.getUrl();
  } catch (err) {
    throw new Error("Error al subir archivo a Drive: " + err.message);
  }
}