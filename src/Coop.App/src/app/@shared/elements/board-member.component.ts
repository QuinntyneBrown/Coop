import { StyleInfo, styleMap } from 'lit/directives/style-map.js';
import { html, render } from "lit";
import { ifDefined } from 'lit/directives/if-defined.js';

export class BoardMemberComponent extends HTMLElement {
    private _src: string;
    private _heading: string;
    private _description: string;

    get template() {
      let hostStyles: StyleInfo = {
        display: "grid",
        gridTemplateColumns:"auto 1fr",
        columnGap: "30px",
      }

      let textStyles = {
        margin: "0", fontWeight: "400"
      };

      let headingStyles = {
        ...textStyles,
        ...{
          fontSize: "1.75rem",
          lineHeight: "3rem"
        }
      };

      let descriptionStyles = {
        ...textStyles,
        ...{
          fontSize: "1rem",
          lineHeight: "2rem"
        }
      }

      let avatarStyles: StyleInfo = {
        display: "block",
        width: "9.375rem",
        height: "9.375rem",
        borderRadius: "50%",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundImage: `url('${this._src}')`
      };

      let descriptionContainerStyles: StyleInfo = {
        display: "grid",
        placeItems:"center start"
      }

        return html`
        <div style=${styleMap(hostStyles)}>
          <div>
            <div style=${styleMap(avatarStyles)}></div>
          </div>

          <div style=${styleMap(descriptionContainerStyles)}>

            <div>
              <h2 ${ifDefined(this._heading)} style=${styleMap(headingStyles)}>${this._heading}</h2>
              <p ${ifDefined(this._description)} style=${styleMap(descriptionStyles)}>${this._description}</p>
            </div>
          </div>
        </div>

        `;
    }

    static get observedAttributes(): string[] {
        return [
          "src",
          "heading",
          "description"
        ];
    }

    connectedCallback() {
      if (!this.shadowRoot) this.attachShadow({ mode: 'open' });

      render(this.template, this.shadowRoot as DocumentFragment)
    }

    attributeChangedCallback (name, oldValue, newValue) {
      switch(name) {

        case "src":
          this._src = newValue;
          break;

        case "heading":
          this._heading = newValue;
          break;

        case "description":
          this._description = newValue;
          break;

      }
    }
}

export function registerBoardMember() {
    try {
      customElements.define('ce-board-member', BoardMemberComponent);
    } catch {
      console.warn('ce-board-member already registered');
    }
}
