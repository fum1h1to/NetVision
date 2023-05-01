import './Information.scss'

export class Information {
  private abuseColor: string;
  private attackColor: string;
  private spamColor: string;
  private defualtColor: string;

  constructor() {
    this.abuseColor = this.toColorString(globalThis.constantManager.getABUSEIPDB_IP_COLOR());
    this.attackColor = this.toColorString(globalThis.constantManager.getBLOCKLIST_DE_IP_COLOR());
    this.spamColor = this.toColorString(globalThis.constantManager.getSPAMHAUS_IP_COLOR());
    this.defualtColor = this.toColorString(globalThis.constantManager.getDEFAULT_PACKET_COLOR());
  }

  public insertTo(ele: HTMLElement) {
    ele.insertAdjacentHTML('beforeend', this.getHTML());
    this.setup();
  }

  private setup() {

  }

  private toColorString(color: number): string {
    return `#${color.toString(16).padStart(6, '0')}`;
  }

  private getHTML(): string {

    return (
      `
<div class="netVision-information dark">
  <div class="netVision-information__cont overflow-x-auto shadow-md sm:rounded-lg">
    <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <caption class="p-5 text-lg font-semibold text-left text-gray-900 bg-white dark:text-white dark:bg-gray-800">
        Information
      </caption>
      <tbody>
        ${globalThis.constantManager.getIS_ABUSEIPDB_USE() ? 
        `<tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
          <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white" style="color: ${this.abuseColor}">
            -----
          </th>
          <td class="px-6 py-4">
            From AbuseIP
          </td>
        </tr>` : ``
        }
        <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
          <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white" style="color: ${this.attackColor}">
            -----
          </th>
          <td class="px-6 py-4">
            From Attacked IP
          </td>
        </tr>
        <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
          <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white" style="color: ${this.spamColor}">
            -----
          </th>
          <td class="px-6 py-4">
            From Spam IP
          </td>
        </tr>
        <tr class="bg-white dark:bg-gray-800">
          <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white" style="color: ${this.defualtColor}">
            -----
          </th>
          <td class="px-6 py-4">
            From Normal IP
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
      `
    )
  }
}