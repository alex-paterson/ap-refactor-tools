import * as vscode from 'vscode'
import changeFileExtensions from './commands/changeFileExtensions'
// import openFilesWithErrors from './commands/openFilesWithErrors'
import quickEditMatchingFiles, { notifyListeners } from './commands/quickEditMatchingFiles'

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(vscode.commands.registerCommand('refactor.onDiffAccepted', notifyListeners(true)))
  context.subscriptions.push(vscode.commands.registerCommand('refactor.onDiffRejected', notifyListeners(false)))

  // context.subscriptions.push(vscode.commands.registerCommand(
  //   'refactor.openFilesWithErrors',
  //   () => {
  //     openFilesWithErrors() // This is the function provided
  //   },
  // ))

  context.subscriptions.push(vscode.commands.registerCommand(
    'refactor.quickEditMatchingFiles',
    () => {
      quickEditMatchingFiles() // This is the function provided
    },
  ))
  context.subscriptions.push(vscode.commands.registerCommand(
    'refactor.changeFileExtensions',
    () => {
      changeFileExtensions() // This is the function provided
    },
  ))
}

export function deactivate() {}