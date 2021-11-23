<template>
  <div class="flex-column recipients-container">
    <span class="flex-row justify-content-between">
      <h2>Recipients</h2>
      <div class="flex-row align-items-center">
        <button type="button"
                class="btn btn-primary mb-1"
                @click="showAddRecipientDialog()"
                title="Add Recipient"
                data-bs-toggle="tooltip"
                data-bs-placement="top">
          <i class="bi bi-plus-lg"></i>
        </button>
      </div>
    </span>
    <table class="table table-dark">
      <colgroup>
        <col style="width: 100%;">
        <col style="width: 50px">
      </colgroup>
      <thead class="thead-dark">
        <tr>
          <th>Name</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="recipient in recipients"
            :key="recipient.id">
          <td>
            <div v-if="recipient.isEditing">
              <input id="name"
                    type="text"
                    v-model="editRecipient.name"
                    name="name"
                    class="form-control"
                    required>
            </div>
            <div v-if="!recipient.isEditing">
              {{ recipient.name }}
            </div>
          </td>
          <td class="icons-cell">
            <div class="icons-container">
              <button v-if="!recipient.isEditing" 
                      type="button" 
                      class="btn link-primary" 
                      @click="startEditing(recipient)">
                <i class="bi bi-pencil-fill"></i>
              </button>
              <button v-if="!recipient.isEditing" 
                      type="button" 
                      class="btn link-danger"
                      @click="confirmDelete(recipient)">
                <i class="bi bi-trash-fill"></i>
              </button>
              <button v-if="recipient.isEditing" 
                      type="button" 
                      class="btn link-success" 
                      @click="save(editRecipient)">
                <i class="bi bi-check-circle-fill"></i>
              </button>
              <button v-if="recipient.isEditing" 
                      type="button" 
                      class="btn link-secondary" 
                      @click="cancelEditing(recipient)">
                <i class="bi bi-x-circle-fill"></i>
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <DeleteConfirmation ref="deleteConfirmationModal" />
</template>

<script>
import { mapState } from 'vuex'
import DeleteConfirmation from '../shared/DeleteConfirmation.vue'

export default {
  name: 'ManageRecipients',
  components: {
    DeleteConfirmation
  },
  computed: {
    ...mapState({
      recipients: state => state.recipients.all
    })
  },
  created () {
    this.$store.dispatch('recipients/get')
  },
  methods: {
    startEditing (recipient) {
      const unsavedRecipient = this.recipients.find(t => t.isEditing)
      if (unsavedRecipient) {
        this.cancelEditing(unsavedRecipient)
      }
      const dateString = this.$filters.toShortDate(new Date(recipient.date), 'yyyy-MM-dd')
      this.editRecipient = { ...recipient, date: dateString }
      this.$store.commit('recipients/setRecipientIsEditing', { ...recipient, isEditing: true })
    },

    cancelEditing (recipient) {
      this.$store.commit('recipients/setRecipientIsEditing', { ...recipient, isEditing: false })
    },

    async save (recipient) {
      await this.$store.dispatch('recipients/update', recipient)
    },

    confirmDelete (recipient) {
      if (this.$refs.deleteConfirmationModal && recipient) {
        this.$refs.deleteConfirmationModal.open(this.delete, recipient.id, null)
      }
    },

    async delete (id) {
      await this.$store.dispatch('recipients/delete', id)
      this.recipients.splice(this.recipients.findIndex(t => t.id === id), 1)
    },

    showAddRecipientDialog () {

    }
  }
}
</script>

<style scoped lang="scss">
  .recipients-container {
    width: 500px;
    margin: 0 auto;
  }
</style>
