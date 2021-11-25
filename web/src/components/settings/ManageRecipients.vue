<template>
  <div class="flex-column recipients-container">
    <span class="flex-row justify-content-between">
      <h2 class="text-light">Recipients</h2>
      <div class="flex-row align-items-center">
        <button type="button"
                class="btn btn-primary mb-1"
                @click="addRow()"
                title="Add Recipient"
                data-bs-toggle="tooltip"
                data-bs-placement="top">
          <i class="bi bi-plus-lg"></i>
        </button>
      </div>
    </span>
    <table class="table table-dark recipient-table">
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
        <tr v-show="isAddingRow">
          <td class="edit-container">
            <input id="name"
                  ref="nameAddInput"
                  type="text"
                  v-model="name"
                  name="name"
                  class="form-control form-control-sm"
                  @keyup.enter="saveNew()"
                  required>
              <div class="input-errors" v-for="error of v$.name.$errors" :key="error.$uid">
                <div class="error-msg invalid-feedback d-block">{{ error.$message }}</div>
              </div>
          </td>
          <td class="icons-cell">
            <div class="icons-container">
              <button type="button" 
                      class="btn link-success" 
                      @click="saveNew()"
                      :disabled="!v$.$dirty || v$.$invalid">
                <i class="bi bi-check-circle-fill"></i>
              </button>
              <button type="button" 
                      class="btn link-secondary" 
                      @click="cancelEditing()">
                <i class="bi bi-x-circle-fill"></i>
              </button>
            </div>
          </td>
        </tr>
        <tr v-for="recipient in recipients"
            :key="recipient.id">
          <td :class="{ 'edit-container': recipient.isEditing }">
            <div v-if="recipient.isEditing">
              <input id="name"
                    ref="nameInput"
                    type="text"
                    v-model="name"
                    name="name"
                    class="form-control form-control-sm"
                    @keyup.enter="saveNew()"
                    required>
              <div class="input-errors" v-for="error of v$.name.$errors" :key="error.$uid">
                <div class="error-msg invalid-feedback d-block">{{ error.$message }}</div>
              </div>
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
                      @click="save(editRecipient)"
                      :disabled="!v$.$dirty || v$.$invalid">
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
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'

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
  data () {
    return {
      isAddingRow: false,
      name: null
    }
  },
  methods: {
    startEditing (recipient) {
      const unsavedRecipient = this.recipients.find(t => t.isEditing)
      this.cancelEditing(unsavedRecipient)

      this.name = recipient.name
      this.v$.$reset()
      this.$store.commit('recipients/setRecipientIsEditing', { ...recipient, isEditing: true })

      this.$nextTick(() => {
        this.$refs.nameInput.focus()
      })
    },

    cancelEditing (recipient) {
      if (recipient) {
        this.$store.commit('recipients/setRecipientIsEditing', { ...recipient, isEditing: false })
      } else {
        this.isAddingRow = false
      }
    },

    async save (recipient) {
      if (!this.v$.$dirty || this.v$.$invalid) {
        return
      }
      await this.$store.dispatch('recipients/update', recipient)
    },

    async saveNew () {
      if (!this.v$.$dirty || this.v$.$invalid) {
        return
      }
      await this.$store.dispatch('recipients/create', { name: this.name })
      this.isAddingRow = false
    },

    confirmDelete (recipient) {
      if (this.$refs.deleteConfirmationModal && recipient) {
        this.$refs.deleteConfirmationModal.open(this.delete, recipient.id, null)
      }
    },

    async delete (id) {
      await this.$store.dispatch('recipients/delete', id)
    },

    addRow () {
      const unsavedRecipient = this.recipients.find(t => t.isEditing)
      if (unsavedRecipient) {
        this.cancelEditing(unsavedRecipient)
      }

      this.name = ''
      this.v$.$reset()
      this.isAddingRow = true

      this.$nextTick(() => {
        this.$refs.nameAddInput.focus()
      })
    }
  },
  setup () {
    return { v$: useVuelidate() }
  },
  validations () {
    return {
      name: { required, $autoDirty: true }
    }
  }
}
</script>

<style scoped lang="scss">
  .recipient-table tr {
    height: 41px;

    td {
      vertical-align: middle;
    }
  }
  .recipients-container {
    width: 500px;
    margin: 0 auto;
  }

  .edit-container {
    padding: 0;
  }
</style>
