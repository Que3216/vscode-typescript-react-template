import { window, workspace, commands, Disposable, ExtensionContext, TextDocument, Position, Range, TextDocumentWillSaveEvent } from 'vscode';
import { dirname, join, resolve, relative, extname, basename } from "path";
import { existsSync, readFileSync } from "fs";

// this method is called when your extension is activated. activation is
// controlled by the activation events defined in package.json
export function activate(ctx: ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Typescript React Templater is now active');

    const templater = new Templater();
    const controller = new TemplaterController(templater);

    ctx.subscriptions.push(controller);
    ctx.subscriptions.push(templater);
}

export class Templater {
    public fillOutTemplateIfEmpty() {
        console.log("Opened doc");
        const editor = window.activeTextEditor;
        if (!editor) {
            return;
        }

        const doc = editor.document;

        if (doc.getText().length !== 0) {
            return;
        }

        const isReact = doc.languageId === "typescriptreact";

        if (!isReact) {
            return;
        }

        console.log("Doc!");

        const componentName = basename(doc.fileName, extname(doc.fileName));

        const template = [
            `import * as React from "react";`,
            ``,
            `interface ${componentName}Props {`,
            `}`,
            ``,
            `interface ${componentName}State {`,
            `}`,
            ``,
            `class ${componentName} extends React.PureComponent<${componentName}Props, ${componentName}State> {`,
            `   render() {`,
            `       return (`,
            `           <div>`,
            `               Hello World`,
            `           </div>`,
            `       );`,
            `   }`,
            `}`,
            ``
        ].join("\n");

        const packagesDirectoryMatch = doc.fileName.match(/(.*\/packages)\/[^\/]*\//);

        if (packagesDirectoryMatch == null) {
            return;
        }

        editor.edit(builder => {
            builder.insert(doc.positionAt(0), template);
        });
    }

    public dispose() {
    }
}

class TemplaterController {

    private _templater: Templater;
    private _disposable: Disposable;

    constructor(templater: Templater) {
        this._templater = templater;

        // subscribe to selection change and editor activation events
        let subscriptions: Disposable[] = [];
        workspace.onDidOpenTextDocument(this._onEvent, this, subscriptions);

        // create a combined disposable from both event subscriptions
        this._disposable = Disposable.from(...subscriptions);
    }

    private _onEvent() {
        this._templater.fillOutTemplateIfEmpty();
    }

    public dispose() {
        this._disposable.dispose();
    }
}

function escapeRegExp(str: string) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}
