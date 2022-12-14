<template>
  <BModal v-model:show="show" title="Add Transaction">
    <template #dialog-content>
      <div class="flex flex-col">
        <div class="flex flex-col p-5">
          <label for="cost" class="form-label">Cost</label>
          <div class="flex flex-row items-center">
            <Switch
              v-model="isPositive"
              :class="isPositive ? 'bg-green-600' : 'bg-red-500'"
              class="inline-flex h-6 w-11 items-center rounded-full"
            >
              <span class="sr-only">Toggle Positive/Negative</span>
              <span
                :class="isPositive ? 'translate-x-5' : 'translate-x-0'"
                class="inline-block h-4 w-4 transform rounded-full bg-white transition"
              ></span>
            </Switch>

            <i
              class="bi text-xl mx-2"
              :class="
                isPositive
                  ? 'bi-plus-lg text-green-600'
                  : 'bi-dash-lg text-red-500'
              "
            ></i>

            <CurrencyInput
              v-model="v$.cost.$model"
              name="cost"
              :options="{
                currency: 'USD',
                precision: 2,
                autoDecimalDigits: true,
              }"
              required
            />
          </div>
          <div
            class="text-red-500 text-sm"
            v-for="error of v$.cost.$errors"
            :key="error.$uid"
          >
            <div class="error-msg invalid-feedback d-block">
              {{ error.$message }}
            </div>
          </div>

          <label for="date" class="mt-1">Date</label>
          <BInput
            v-model="v$.date.$model"
            type="date"
            id="date"
            :class="{ 'is-invalid': v$.date.$error }"
            placeholder="yyyy/MM/dd"
            required
          ></BInput>
          <div
            class="text-red-500 text-sm"
            v-for="error of v$.date.$errors"
            :key="error.$uid"
          >
            <div class="error-msg invalid-feedback d-block">
              {{ error.$message }}
            </div>
          </div>

          <label for="account" class="mt-1">Account</label>
          <BSelect
            id="account"
            v-model="v$.accountId.$model"
            name="account"
            required
          >
            <option
              v-for="account in accounts"
              :key="account.id"
              :value="account.id"
            >
              {{ account.name }}
            </option>
          </BSelect>
          <div
            class="text-red-500 text-sm"
            v-for="error of v$.accountId.$errors"
            :key="error.$uid"
          >
            <div class="error-msg invalid-feedback d-block">
              {{ error.$message }}
            </div>
          </div>

          <label for="category" class="mt-1">Category</label>
          <BSelect
            id="category"
            v-model="v$.categoryId.$model"
            name="category"
            required
          >
            <option :value="null">Ready to Budget</option>
            <option
              v-for="category in categories"
              :key="category.id"
              :value="category.id"
            >
              {{ category.name }}
            </option>
          </BSelect>
          <div
            class="text-red-500 text-sm"
            v-for="error of v$.categoryId.$errors"
            :key="error.$uid"
          >
            <div class="error-msg invalid-feedback d-block">
              {{ error.$message }}
            </div>
          </div>

          <label for="recipient" class="mt-1">Recipient</label>
          <BSelect
            id="recipient"
            v-model="v$.recipientId.$model"
            name="recipient"
            required
          >
            <option
              v-for="recipient in recipients"
              :key="recipient.id"
              :value="recipient.id"
            >
              {{ recipient.name }}
            </option>
          </BSelect>
          <div
            class="text-red-500 text-sm"
            v-for="error of v$.recipientId.$errors"
            :key="error.$uid"
          >
            <div class="error-msg invalid-feedback d-block">
              {{ error.$message }}
            </div>
          </div>
        </div>

        <div class="flex flex-row justify-end px-4 pb-4">
          <BButton
            @click="close()"
            text="Cancel"
            type="default-outline"
            class="mr-2"
          ></BButton>

          <BButton
            @click="save()"
            text="Save"
            type="primary"
            icon="save-fill"
            :disabled="!v$.$dirty || v$.$invalid"
          ></BButton>
        </div>
      </div>
    </template>
  </BModal>
</template>

<script setup lang="ts">
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { Switch } from '@headlessui/vue'

import { toShortDate } from '@/helpers/helpers'

import CurrencyInput from '../shared/CurrencyInput.vue'
import {
  type Ref,
  ref,
  computed,
  type ComputedRef,
  reactive,
  onMounted,
  nextTick,
} from 'vue'
import type { Account, Category, Recipient, Transaction } from '@/models'
import {
  useAccountStore,
  useCategoryStore,
  useRecipientStore,
  useTransactionStore,
} from '@/store'
import { BButton, BInput, BModal, BSelect } from '@/components/shared'

const accountStore = useAccountStore()
const categoryStore = useCategoryStore()
const recipientStore = useRecipientStore()
const transactionStore = useTransactionStore()

const state = reactive({
  date: null as string | null,
  accountId: null as number | null,
  categoryId: null as number | null,
  cost: 0.0 as number,
  recipientId: null as number | null,
})

const rules = {
  date: { required, $autoDirty: true },
  accountId: { required, $autoDirty: true },
  categoryId: { $autoDirty: true },
  cost: { required, $autoDirty: true },
  recipientId: { required, $autoDirty: true },
}

const v$ = useVuelidate(rules, state)

const show: Ref<boolean> = ref(false)
const isPositive: Ref<boolean> = ref(false)

const accounts: ComputedRef<Array<Account>> = computed(() => accountStore.all)
const categories: ComputedRef<Array<Category>> = computed(
  () => categoryStore.all
)
const recipients: ComputedRef<Array<Recipient>> = computed(
  () => recipientStore.all
)

defineExpose({
  open,
})

function open(defaultAccountId: number) {
  show.value = true
  reset(defaultAccountId)
}

function close() {
  show.value = false
}

function reset(newAccountId: number) {
  isPositive.value = false
  state.date = toShortDate(new Date(), 'yyyy-MM-dd')
  state.accountId = newAccountId
  state.categoryId = null
  state.cost = 0.0
  state.recipientId = null
  nextTick(() => {
    v$.value.$reset()
    if (state.date) v$.value.date.$touch()
    if (state.accountId) v$.value.accountId.$touch()
    v$.value.categoryId.$touch()
  })
}

async function save() {
  if (v$.value.invalid) {
    return
  }
  const signedCost = isPositive.value ? state.cost : state.cost * -1
  const transaction = {
    accountId: state.accountId,
    categoryId: state.categoryId,
    date: state.date,
    cost: signedCost,
    recipientId: state.recipientId,
  } as Transaction
  await transactionStore.create(transaction)
  close()
}

onMounted(() => {
  if (!categories.value?.length) {
    categoryStore.get()
  }
  if (!recipients.value?.length) {
    recipientStore.get()
  }
})
</script>

<style scoped>
.cost-sign {
  line-height: 0.25;
  width: 16px;
}
</style>
