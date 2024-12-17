import * as vscode from 'vscode';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
  const sendEditorToFindInFilesCommand = vscode.commands.registerCommand('find-all-in-files.sendEditorToFindInFiles', (commandContext) => {
    if (commandContext.scheme !== "file") {
      vscode.window.showErrorMessage("Tab is not a Text Editor!");
      return;
    }

    vscode.commands.executeCommand(
      "find-all-in-files.sendFileToFindInFiles",
      vscode.Uri.from(commandContext)
    );
  });

  context.subscriptions.push(sendEditorToFindInFilesCommand);


  const sendEditorToFindInFilesKeybindCommand = vscode.commands.registerCommand('find-all-in-files.sendEditorToFindInFilesKeybind', () => {
    if (!vscode.window.activeTextEditor || vscode.window.activeTextEditor.document.uri.scheme !== "file") {
      vscode.window.showErrorMessage("Active tab is not a Text Editor!");
      return;
    }

    const filePath = vscode.window.activeTextEditor.document.uri.fsPath;

    const folders = vscode.workspace.workspaceFolders;
    if (folders && folders.length > 0) {
      // Find the workspace folder that contains the file
      const matchingFolders = folders.filter(folder => filePath.startsWith(folder.uri.fsPath));
      // Find the longest and shortest matching folder
      const longestFolder = matchingFolders.reduce((longest, current) => {
        return current.uri.fsPath.length > longest.uri.fsPath.length ? current : longest;
      }, matchingFolders[0]);

      /* const shortestFolder = matchingFolders.reduce((shortest, current) => {
        return current.uri.fsPath.length < shortest.uri.fsPath.length ? current : shortest;
      }, matchingFolders[0]); */

      let folderPath = '';
      // Calculate the relative path from the workspace folder
      /* if (longestFolder !== shortestFolder) {
        // Multiple Workspace Folders
        folderPath = path.relative(shortestFolder.uri.fsPath, longestFolder.uri.fsPath);
      } else  */if (longestFolder) {
        // Single Workspace Folder
        folderPath = path.basename(longestFolder.uri.fsPath);
      }
      if (folderPath !== '') {
          // Execute the Find in Files command with the workspace folder's path and query
          vscode.commands.executeCommand('workbench.action.findInFiles', {
            filesToInclude: folderPath
        });
      } else {
        vscode.window.showErrorMessage('File is not in any workspace folder.');
      }
    } else {
      vscode.window.showErrorMessage('No workspace folder found.');
    }
    
  });

  context.subscriptions.push(sendEditorToFindInFilesKeybindCommand);


  const sendFileToFindInFilesCommand = vscode.commands.registerCommand('find-all-in-files.sendFileToFindInFiles', (uri: vscode.Uri) => {
    const filePath = uri.fsPath;

    const folders = vscode.workspace.workspaceFolders;
    if (folders && folders.length > 0) {
      // Find the workspace folder that contains the file
      const matchingFolders = folders.filter(folder => filePath.startsWith(folder.uri.fsPath));
      const folder = matchingFolders.reduce((longest, current) => {
        return current.uri.fsPath.length > longest.uri.fsPath.length ? current : longest;
      }, matchingFolders[0]);

      if (folder) {
        // Calculate the relative path from the workspace folder
        const relativePath = path.relative(folder.uri.fsPath, filePath);

          // Execute the Find in Files command with the relative path and query
          vscode.commands.executeCommand('workbench.action.findInFiles', {
            filesToInclude: relativePath
        });
      } else {
        vscode.window.showErrorMessage('File is not in any workspace folder.');
      }
    } else {
      vscode.window.showErrorMessage('No workspace folder found.');
    }
  });

  context.subscriptions.push(sendFileToFindInFilesCommand);
}
