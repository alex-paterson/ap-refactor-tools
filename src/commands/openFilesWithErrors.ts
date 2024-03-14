// import { ESLint } from 'eslint';
// import * as vscode from 'vscode';

// export default async function openFilesWithErrors() {
//   // Prompt the user for the directory from which to run ESLint
//   // const eslintDirectory = await vscode.window.showInputBox({
//   //   prompt: 'Enter the directory from which to run ESLint (e.g., ./packages/my-package)',
//   //   value: 'packages/frontend', // Default to the current workspace root
//   // });

//   if (
//     // !eslintDirectory ||
//     !vscode.workspace.workspaceFolders
//   ) {
//     vscode.window.showErrorMessage('ESLint directory is required and a workspace must be open.');
//     return;
//   }

//   // Convert the relative path to an absolute path based on the workspace folder
//   const workspaceRoot = vscode.workspace.workspaceFolders[0].uri.fsPath;
//   // const absoluteEslintDirectory = vscode.Uri.joinPath(vscode.Uri.file(workspaceRoot), eslintDirectory).fsPath;

//   // Prompt the user for a glob pattern for the files to lint
//   const inputGlob = await vscode.window.showInputBox({
//     prompt: 'Enter the glob pattern for files you want to lint (e.g., src/**/*.ts)',
//     value: 'packages/frontend/src/api/**/*.ts', // Provide a default value
//   });

//   if (!inputGlob) {
//     return; // Exit if no glob pattern is provided
//   }

//   // Initialize ESLint with the specified current working directory
//   const eslint = new ESLint({ cwd: workspaceRoot });
//   console.log('==== absoluteEslintDirectory', workspaceRoot)
//   const results = await eslint.lintFiles([inputGlob]);

//   // Filter results to get only files with errors (not warnings)
//   const filesWithErrors = results.filter(result => result.errorCount > 0);

//   console.log('==== first error', results[0].messages[0])

//   // Open each file with errors in a new editor tab
//   for (const file of filesWithErrors) {
//     const uri = vscode.Uri.file(file.filePath);
//     try {
//       const document = await vscode.workspace.openTextDocument(uri);
//       await vscode.window.showTextDocument(document, { preview: false });
//     } catch (error) {
//       console.error(`Failed to open file: ${file.filePath}`, error);
//     }

//     // just one for now
//     break
//   }

//   if (filesWithErrors.length > 0) {
//     vscode.window.showInformationMessage(`Opened ${filesWithErrors.length} files with linting errors.`);
//   } else {
//     vscode.window.showInformationMessage(`No linting errors found.`);
//   }
// }