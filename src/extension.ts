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

    vscode.commands.executeCommand(
      "find-all-in-files.sendFileToFindInFiles",
      vscode.window.activeTextEditor.document.uri
    );
  });

  context.subscriptions.push(sendEditorToFindInFilesKeybindCommand);


  const sendFileToFindInFilesCommand = vscode.commands.registerCommand('find-all-in-files.sendFileToFindInFiles', (uri: vscode.Uri) => {
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

  context.subscriptions.push(sendFileToFindInFilesCommand);
}
