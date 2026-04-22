const DRIVE_FOLDER_ID = '1skKFals4BEjHf_wRkdt0OxZqAY5OSL0e';

function formatoB_get() {
  const data = SheetService.readObjects_(APP_CONFIG.SHEETS.ACTIVIDADES);
  return data.map(it => ({
    id: String(it.id || ''),
    titulo: it.titulo || '',
    descripcion: it.descripcion || '',
    objetivo: it.objetivo || '',
    tipo: it.tipo || it.categoria || 'General',
    estado: 'FINALIZADO',
    impacto: it.impacto || '',
    fecha: it.fecha || '',
    beneficiarios: it.beneficiarios || '',
    logro: it.logro || '',
    eje: it.ejeestrategico || it.eje || '',
    imagen: it.imagen || it.imagenurl || ''
  }));
}

function formatoB_save(data) {
  try {
    const isEdit = !!data.id;
    let fileUrl = '';

    // Subida de archivo si existe
    if (data.fileData && data.fileData.base64) {
      fileUrl = uploadFileToDrive_(data.fileData.base64, data.fileData.name, data.fileData.type);
    }

    const rowData = {
      id: data.id || Utilities.getUuid(),
      titulo: data.titulo,
      fecha: data.fecha,
      descripcion: data.descripcion,
      objetivo: data.objetivo || '',
      logro: data.logro || '',
      tipo: 'General',
      estado: 'FINALIZADO',
      impacto: data.impacto || '',
      beneficiarios: data.beneficiarios || '',
      ejeestrategico: data.eje,
    };

    // Si se subió un archivo, actualizar el campo imagen (url)
    if (fileUrl) {
      rowData.imagen = fileUrl;
    }

    if (isEdit) {
      return { success: SheetService.updateObjectById_(APP_CONFIG.SHEETS.ACTIVIDADES, data.id, rowData) };
    } else {
      SheetService.saveObject_(APP_CONFIG.SHEETS.ACTIVIDADES, rowData);
      return { success: true };
    }
  } catch(e) { return { success: false, message: String(e) }; }
}

/**
 * Helper para subir archivos a Google Drive
 */
function uploadFileToDrive_(base64, fileName, mimeType) {
  try {
    const folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
    const decoded = Utilities.base64Decode(base64);
    const blob = Utilities.newBlob(decoded, mimeType, fileName);
    const file = folder.createFile(blob);
    
    // Hacer público por enlace (opcional, recomendado para visualización)
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    
    return file.getUrl();
  } catch (err) {
    throw new Error("Error al subir archivo a Drive: " + err.message);
  }
}