import { Modal } from 'flowbite'
import type { ModalOptions, ModalInterface } from 'flowbite'
import './Setting.scss'
import { LatLng } from '../../models/LatLng';

export class Setting {

  constructor() {

  }

  public insertTo(ele: HTMLElement) {
    ele.insertAdjacentHTML('beforeend', this.getHTML());
    this.setup();
  }

  private setup() {
    const form = document.querySelector('#netVision-form-setting') as HTMLFormElement;

    const rootEle = document.querySelector('.netVision-setting') as HTMLElement;

    if (rootEle) {
      const openBtn = rootEle.querySelector('.js-setting-open') as HTMLElement;

      const $modalElement: HTMLElement | null = document.querySelector('#netVision-settingModal');

      const modalOptions: ModalOptions = {
        placement: 'center',
        backdrop: 'dynamic',
        backdropClasses: 'bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-40',
        closable: true,
      }

      const modal: ModalInterface = new Modal($modalElement, modalOptions);

      openBtn.addEventListener('click', () => {
        const latlng = globalThis.constantManager.getPACKET_GOAL() as LatLng;
        form.lat.value  = latlng.lat;
        form.lng.value = latlng.lng;
        modal.show();
      })

      const closeBtn = rootEle.querySelectorAll('.js-setting-close');
      closeBtn.forEach((btn) => {
        btn.addEventListener('click', () => {
          modal.hide();
        })
      })

      const updateBtn = rootEle.querySelectorAll('.js-setting-update');
      updateBtn.forEach((btn) => {
        btn.addEventListener('click', () => {
          if (!this.checkLatLng(form.lat.value, form.lng.value)) {
            alert('緯度経度の値が不正です。');
            return;
          }
          const lat = form.lat.value;
          const lng = form.lng.value;
          globalThis.constantManager.setPACKET_GOAL({ lat: lat, lng: lng });
          modal.hide();
        })
      })
    }
  }

  private checkLatLng(lat: string, lng: string): boolean {
    if (lat === '' || lng === '') {
      return false;
    }
    if (isNaN(Number(lat)) || isNaN(Number(lng))) {
      return false;
    }
    if (Number(lat) < -90 || Number(lat) > 90) {
      return false;
    }
    if (Number(lng) < -180 || Number(lng) > 180) {
      return false;
    }
    return true;
  }

  private getHTML(): string {

    return (
      // Setting.htmlからのコピペで運用（なんかよい方法があれば変更）
      `
      <div class="netVision-setting">
      <button data-modal-target="netVision-settingModal" data-modal-toggle="netVision-settingModal" type="button"
        class="netVision-setting__btn js-setting-open text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center mr-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800 dark:hover:bg-blue-500">
        <svg fill="none" class="w-7 h-7" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z">
          </path>
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
        </svg>
      </button>
    
      <!-- Default Modal -->
      <div id="netVision-settingModal" tabindex="-1"
        class="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] md:h-full">
        <div class="relative w-full h-full max-w-lg md:h-auto">
          <!-- Modal content -->
          <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <!-- Modal header -->
            <div class="flex items-center justify-between p-5 border-b rounded-t dark:border-gray-600">
              <h3 class="text-xl font-medium text-gray-900 dark:text-white">
                Settings
              </h3>
              <button type="button"
                class="js-setting-close text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white">
                <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd"></path>
                </svg>
                <span class="sr-only">Close modal</span>
              </button>
            </div>
            <!-- Modal body -->
            <div class="p-6 space-y-6">
              <form id="netVision-form-setting" class="js-setting-form">
                <div class="grid md:grid-cols-2 md:gap-6">
                  <div class="relative z-0 w-full mb-6 group">
                      <input type="text" name="lat" id="netVision-form-setting_lat" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                      <label for="netVision-form-setting_lat" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">パケット到達地点の緯度</label>
                  </div>
                  <div class="relative z-0 w-full mb-6 group">
                      <input type="text" name="lng" id="netVision-form-setting_lng" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                      <label for="netVision-form-setting_lng" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">パケット到達地点の経度</label>
                  </div>
                </div>
              </form>
            </div>
            <!-- Modal footer -->
            <div class="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
              <button type="button"
                class="js-setting-update text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">I
                accept</button>
              <button type="button"
                class="js-setting-close text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">Decline</button>
            </div>
          </div>
        </div>
      </div>
    </div>
      `
    )
  }
}