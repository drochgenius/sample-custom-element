import { LitElement, TemplateResult, html, property, css, CSSResult, CSSResultArray } from 'lit-element';
import * from './item-card/item-hints';
/**
 * `<quote-of-the-day>` element
 */
 export class ItemCard extends LitElement<string> {
    @property({ type: String })
    public hintContent: string;

    @property({ type: String })
    public feedbackContent: string;

    private feedback: FeedbackMessage[];

    private hints: String[];

    public ishintContent: String = 'hide';
    public ishint: String = 'hide';

    public static get styles(): CSSResult | CSSResultArray {
        return [
            css`
                :host {
                }
                .hide {
                    display: none;
                }
                .show {
                    display: block;
                }
            `,
        ];
    }
    protected render(): TemplateResult {
        return html`
            <main>
                <!-- answer mechanism goes in the slot: waggle-activity -->
                <slot @click="${(): void => this.fetchHints(activityElement.getValue())}"></slot>
                <item-hints class="${this.ishintContent}" hint-content="${this.hintContent}" feedback-content=""></item-hints>
                <footer class="${this.ishint}">
                    <div>
                        <div>
                            <span> Hints:</span>

                            ${activityElement.state === 'ready'
                                ? this.hints.map(
                                      (currElement, index) =>
                                          html`
                                              <span id="${currElement}-${index}" @click="${(): void => this.updateContent(index)}">${index + 1}</span>
                                          `
                                  )
                                : ''}
                        </div>
                        <div>
                            <button @click="${(): void => this.checkAnswer()}">Check Answer</button>
                        </div>
                    </div>
                </footer>
            </main>
        `;
    }
    private fetchHints(e: any): void {
        if (e[0].length === 0) {
            this.hints = activityElement.getHints();
            this.ishint = 'show';
            this.requestUpdate();
        }
    }
    private updateContent(hintid: any): void {
        if (hintid != -1) {
            this.ishintContent = 'show';
            this.hints = activityElement.getHints();
            this.hintContent = this.hints[hintid];
        }
    }
    private checkAnswer(): void {
        this.ishintContent = 'show';
        this.feedback = activityElement.getFeedback();
        this.hintContent = this.feedback[0].message;
    }
}

/* istanbul ignore else */
if (!customElements.get('item-card')) {
    customElements.define('item-card', ItemCard);
} else {
    console.warn("the component item-preview cant't be declared more than once");
}
