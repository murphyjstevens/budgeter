<template>
  <div class="modal fade" id="exampleModal" ref="modal" tabindex="-1" aria-labelledby="modalTitle" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="modalTitle">Add Category Group</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="container-fluid">
            <div class="row gy-3">
              <div class="col-sm-12">
                <label for="name" class="form-label">Name</label>
                <input id="name"
                       v-model="name"
                       v-select-all
                       type="text"
                       name="name"
                       class="form-control"
                       @blur="v$.name.$touch"
                       required>
                <div class="input-errors" v-for="error of v$.name.$errors" :key="error.$uid">
                  <div class="error-msg invalid-feedback d-block">{{ error.$message }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button"
            class="btn btn-secondary"
            @click="close()">Close</button>
          <button type="button"
            class="btn btn-primary"
            :disabled="!v$.$dirty || v$.$invalid"
            @click="save()">Save</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Modal } from 'bootstrap'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'

export default {
  name: 'CategoryGroupDialog',
  data () {
    return {
      modal: undefined,
      name: undefined
    }
  },
  methods: {
    open () {
      this.modal.show()
      this.reset()
    },
    close () {
      this.modal.hide()
    },
    reset () {
      this.name = null
      this.$nextTick(() => {
        this.v$.$reset()
      })
    },
    async save () {
      if (this.v$.invalid) {
        return
      }
      const group = {
        name: this.name,
        sortOrder: this.$store.state.categoryGroups.all.length + 1
      }
      await this.$store.dispatch('categoryGroups/create', group)
      this.close()
    }
  },
  mounted () {
    this.modal = new Modal(this.$refs.modal, {})
  },
  setup () {
    return { v$: useVuelidate() }
  },
  validations () {
    return {
      name: { required }
    }
  }
}
</script>
