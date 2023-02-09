var doneFilename = 'clone_done_identifer.txt';
var trashid = "0AN4hdaslv30wUXXXXX";
var srcid = "0AN4hdaslv30wUkXXXX"
var dstid = "0AK11abRJVfmPUkXXXX"

// Run this function to clone all files in srcid to dstid
function clone() {
  var src = DriveApp.getFolderById(srcid);
  var dst = DriveApp.getFolderById(dstid);

  cloneFolders(src, dst);
    
}

// If something is failed, you need to remove doneFilename to restart from the very beginning.
function RemoveDoneIdentifier() {
  var src = DriveApp.getFolderById(srcid);

  RemoveDoneIdentifierFolder(src)
}

function RemoveDoneIdentifierFolder(srcFolder) {
  if(!srcFolder.getFilesByName(doneFilename).hasNext()) {
    Logger.log("skip this folder because we don't have file: "+ doneFilename + ", folder: " + srcFolder.getName());
    return;
  }
  var folders = srcFolder.getFolders();
  while(folders.hasNext()) {
    var src = folders.next();
    RemoveDoneIdentifierFolder(src);
  }
  var trashDir = DriveApp.getFolderById(trashid);
  var files = srcFolder.getFilesByName(doneFilename)
  while(files.hasNext()) {
    var f = files.next();
    f.moveTo(trashDir);
  }
  Logger.log("remove done for file: "+ doneFilename + ", dir: "+ srcFolder.getName());
}

function cloneFolders(srcFolder, dstFolder) {
  // if we have doneFilename, skip it.
  if(srcFolder.getFilesByName(doneFilename).hasNext()) {
    Logger.log("skip this folder because we have file: "+ doneFilename + ", folder: " + srcFolder.getName());
    return;
  }
  var folders = srcFolder.getFolders();
  while(folders.hasNext()) {
    var src = folders.next();
    var dstSubFolders = dstFolder.getFoldersByName(src.getName());
    var dst;
    if(dstSubFolders.hasNext()) {
      dst = dstSubFolders.next();
      Logger.log('Already created. folder:' + src.getName());
    } else {
      dst = dstFolder.createFolder(src.getName());
      Logger.log('creating folder:' + src.getName());
    }
    cloneFolders(src, dst);
  }
  var files = srcFolder.getFiles();
  while(files.hasNext()) {
    var src = files.next();
    var dstSubfiles = dstFolder.getFilesByName(src.getName());
    if(dstSubfiles.hasNext()) {
      Logger.log('Already copied. skipping... file:' + src.getName());
    } else {
      src.makeCopy(dstFolder);
      Logger.log('copying a file:' + src.getName());
    }
  }
  srcFolder.createFile(doneFilename, 'duplication is done.');
    Logger.log("done for dir: "+ srcFolder.getName());
}
