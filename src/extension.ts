import * as vscode from 'vscode';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
  const sendToFindInFilesCommand = vscode.commands.registerCommand('find-all-in-files.sendToFindInFiles', (uri: vscode.Uri) => {
    const fileUri = uri.fsPath;

    const folders = vscode.workspace.workspaceFolders;
    if (folders && folders.length > 0) {
      // Find the workspace folder that contains the file
      const folder = folders.find(folder => fileUri.startsWith(folder.uri.fsPath));

      if (folder) {
        // Calculate the relative path from the workspace folder
        const relativePath = path.relative(folder.uri.fsPath, fileUri);

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

  context.subscriptions.push(sendToFindInFilesCommand);
}
