import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.esm.browser.js';

Vue.component('loader', {
  template: `  
  <div class="preloader-wrapper active">
  <div class="spinner-layer spinner-green-only">
    <div class="circle-clipper left">
      <div class="circle"></div>
    </div><div class="gap-patch">
      <div class="circle"></div>
    </div><div class="circle-clipper right">
      <div class="circle"></div>
    </div>
  </div>
</div>`,
});

new Vue({
  el: '#app',
  data() {
    return {
      form: { name: '', value: '' },
      contacts: [],
      isLoading: false,
    };
  },
  computed: {
    canCreate() {},
  },
  methods: {
    async createContact() {
      const { ...contact } = this.form;
      const newContact = await request('/api/contacts', 'POST', contact);
      this.contacts.push(newContact);
      this.form = {};
    },
    async markContact(id) {
      const modifiedContact = await request(`/api/contacts/${id}`, 'PUT');
      let findedContact = this.contacts.find((elem) => elem.id === id);
      findedContact.marked = modifiedContact.marked;
    },
    async deleteContact(id) {
      await request(`/api/contacts/${id}`, 'DELETE');
      this.contacts = this.contacts.filter((elem) => elem.id !== id);
    },
  },
  async mounted() {
    this.isLoading = true;
    this.contacts = await request('/api/contacts');
    this.isLoading = false;
  },
});

async function request(url, method = 'GET', data = null) {
  try {
    const headers = {};
    let body;
    if (data) {
      headers['Content-Type'] = 'application/json';
      body = JSON.stringify(data);
    }
    const response = await fetch(url, { method, headers, body });
    return await response.json();
  } catch (error) {
    console.error(`Problems with request: ${error}`);
  }
}
