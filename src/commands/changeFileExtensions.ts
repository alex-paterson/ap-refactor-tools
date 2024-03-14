import path from 'path'
import * as vscode from 'vscode'

export default async function changeFileExtensions() {
  // Prompt for the input glob pattern
  const inputGlob = await vscode.window.showInputBox({
    prompt: 'Enter the file pattern to search for',
    value: '**/*.js', // Default value
  })
  if (!inputGlob) return // Exit if no input

  // Prompt for the target file extension
  const targetExtension = await vscode.window.showInputBox({
    prompt: 'Enter the target file extension',
    value: '.ts', // Default value
  })
  if (!targetExtension) return // Exit if no input

  // Define exclusion patterns to avoid modifying files in node_modules, dist, etc.
  const excludePatterns = '{**/node_modules/**,**/dist/**}'

  // Find all files matching the input glob and not excluded by excludePatterns
  const files = await vscode.workspace.findFiles(inputGlob, excludePatterns)

  if (files.length === 0) {
    vscode.window.showInformationMessage('No files matched the pattern.')
    return
  }

  // Process each file
  for (const file of files) {
    const parsedPath = path.parse(file.fsPath)
    // Construct the new file path with the target extension
    const newFilePath = path.join(
      parsedPath.dir,
      `${parsedPath.name}${targetExtension}`,
    )
    const newUri = file.with({ path: newFilePath })

    try {
      // Use VSCode API to rename (change extension of) the file
      await vscode.workspace.fs.rename(file, newUri, { overwrite: false })
    } catch (error) {
      // Log errors to the console and show a message to the user
      console.error(
        `Failed to rename ${file.fsPath} to ${newFilePath}: ${error}`,
      )
      vscode.window.showErrorMessage(
        `Failed to rename some files. See console for details.`,
      )
    }
  }

  // Inform the user upon completion
  vscode.window.showInformationMessage(`Processed ${files.length} files.`)
}
