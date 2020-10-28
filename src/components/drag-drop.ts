import { LitElement, html, property, TemplateResult, customElement } from 'lit-element';
import { render } from 'lit-html';

/**
 * `<quote-of-the-day>`
 * @demo ./index.html
 */
@customElement('drag-drop')
export class DragDrop extends LitElement {
    @property() uri: string;

    protected render(): TemplateResult {
        render(
            html`<section class="activity">
                    <div class="stimulus">
                        <img src="/static/images/devil.svg" alt="devil" />
                        <img src="/static/images/devil.svg" alt="devil" />
                        <img src="/static/images/devil.svg" alt="devil" />
                    </div>
                    <div class="stimulus">
                        <img src="/static/images/pumpkin.svg" alt="pumpkin" />
                        <img src="/static/images/pumpkin.svg" alt="pumpkin" />
                        <img src="/static/images/pumpkin.svg" alt="pumpkin" />
                        <img src="/static/images/pumpkin.svg" alt="devil" />
                    </div>
                    <div class="equation">
                        <p>3 + 4 = <span class="drop-zone" @drop="${(evt: DragEvent) => this.onDrop(evt)}"></span></p>
                    </div>
                </section>
                <aside>
                    <div class="drag-zone">
                        <span
                            class="draggable-item"
                            draggable="true"
                            @dragstart="${(evt: DragEvent) => this.onDragStart(evt)}"
                            @dragend="${(evt: DragEvent) => this.onDragEnd(evt)}"
                            >?</span
                        >
                    </div>
                    <div class="drag-zone"><span class="draggable-item" draggable="true">?</span></div>
                    <div class="drag-zone"><span class="draggable-item" draggable="true">?</span></div>
                </aside>`,
            this
        );

        return html`<slot></slot>`;
    }

    private onDragStart(evt: DragEvent) {
        console.log('drag start', evt);
        evt.dataTransfer.dropEffect = 'move';
    }

    private onDragEnd(evt: DragEvent) {
        console.log('drag end', evt);
        evt.dataTransfer.dropEffect = 'move';
    }

    private onDrop(evt: DragEvent) {
        console.log('dropping', evt);
    }
}
