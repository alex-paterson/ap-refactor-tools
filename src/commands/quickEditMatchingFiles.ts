import * as vscode from 'vscode'

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}


const listeners: ((approved?: boolean) => void)[] = []

export const notifyListeners = (approved: boolean) => () => {
  for (const listener of listeners) {
    listener(approved)
  }
}

export default function quickEditMatchingFiles() {
  return new Promise<void>((resolve, reject) => {
    async function performSelectFilesAction() {
      try {
        // 'ensure typescript is being used effectively and return only code'
        const prompt = await vscode.window.showInputBox({
          prompt: 'What would you like the AI to do to the files?',
          value:
            'Add typescript types to this code without functionally changing it.',
        })

        const pattern = await vscode.window.showInputBox({
          prompt: 'Enter the file pattern to search for (e.g., **/*.ts)',
          value: 'packages/frontend/src/api/**/*.ts',
        })

        if (!pattern) {
          vscode.window.showInformationMessage('No pattern provided.')
          return
        }

        const files = await vscode.workspace.findFiles(pattern)

        if (files.length === 0) {
          vscode.window.showInformationMessage('No files matched the pattern.')
          return
        }

        for (const file of files) {
          // Open each file
          const editor = await vscode.window.showTextDocument(file, {
            preview: false,
          })

          // Select all the file content
          const lastLine = editor.document.lineAt(editor.document.lineCount - 1)
          const range = new vscode.Range(
            new vscode.Position(0, 0),
            lastLine.range.end,
          )
          editor.selection = new vscode.Selection(range.start, range.end)

          await vscode.commands.executeCommand('continue.quickEdit', prompt)


          // // auto-approved for now
          // await sleep(40000)
          await sleep(10000)
          await vscode.commands.executeCommand('continue.acceptDiff')
          await sleep(5000)
          resolve()
          // await editor.document.save()
          // resolve()

          // packages/frontend/src/lib/audioStack/*.ts

          // wait for listeners to be called by user confirming or denying
          // await new Promise<void>((resolve) => {
          //   listeners.push(async (approved = true) => {
          //     if (approved) {
          //     //   await editor.document.save()
          //       await vscode.commands.executeCommand('continue.acceptDiff')
          //     }
          //     // setTimeout(() => {
          //     //   editor.document.save()
          //     // }, 2000)
          //     resolve()
          //   })
          // })
        }
      } catch (err) {
        console.error('Failed selecting files matching pattern.')
        reject(err)
      }
    }

    performSelectFilesAction()
  })
}
