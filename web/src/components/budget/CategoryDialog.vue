<template>
  <BModal v-model:show="show" title="Add Category">
    <template #dialog-content>
      <div class="flex flex-col">
        <div class="flex flex-col p-5">
          <label for="category-group">Category Group</label>
          <BSelect
            id="category-group"
            v-model="v$.categoryGroupId.$model"
            name="category-group"
            class="form-control"
            @blur="v$.categoryGroupId.$touch"
            required
          >
            <option
              v-for="group in categoryGroups"
              :key="group.id"
              :value="group.id"
            >
              {{ group.name }}
            </option>
          </BSelect>
          <div
            class="text-red-500 text-sm"
            v-for="error of v$.categoryGroupId.$errors"
            :key="error.$uid"
          >
            {{ error.$message }}
          </div>

          <label for="name" class="mt-1">Name</label>
          <BInput
            id="name"
            v-model="v$.name.$model"
            type="text"
            required
          ></BInput>
          <div
            class="text-red-500 text-sm"
            v-for="error of v$.name.$errors"
            :key="error.$uid"
          >
            {{ error.$message }}
          </div>

          <label for="budget" class="mt-1">Budget</label>
          <CurrencyInput
            id="budget"
            name="budget"
            v-model="v$.budget.$model"
            :options="{
              currency: 'USD',
              precision: 2,
              autoDecimalDigits: true,
            }"
            required
          />
          <div
            class="text-red-500 text-sm"
            v-for="error of v$.budget.$errors"
            :key="error.$uid"
          >
            {{ error.$message }}
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
import {
  computed,
  nextTick,
  reactive,
  ref,
  type ComputedRef,
  type Ref,
} from 'vue'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'

import type { Budget, Category } from '@/models'
import {
  useBudgetStore,
  useCategoryGroupStore,
  useCategoryStore,
  useDateStore,
} from '@/store'
import {
  BButton,
  BInput,
  BModal,
  BSelect,
  CurrencyInput,
} from '@/components/shared'

const budgetStore = useBudgetStore()
const categoryGroupStore = useCategoryGroupStore()
const categoryStore = useCategoryStore()
const dateStore = useDateStore()

const state = reactive({
  name: '' as string,
  budget: 0.0 as number,
  categoryGroupId: undefined as number | undefined,
})

const rules = {
  name: { required, $autoDirty: true },
  budget: { required, $autoDirty: true },
  categoryGroupId: { required, $autoDirty: true },
}

const v$ = useVuelidate(rules, state)

const show: Ref<boolean> = ref(false)

const categoryGroups: ComputedRef<Array<any>> = computed(
  () => categoryGroupStore.all
)

defineExpose({
  open,
})

function open(defaultCategoryGroupId: number) {
  show.value = true
  reset(defaultCategoryGroupId)
}

function close() {
  show.value = false
}

function reset(defaultCategoryGroupId: number) {
  state.name = ''
  state.budget = 0.0
  state.categoryGroupId = defaultCategoryGroupId
  nextTick(() => {
    v$.value.$reset()
  })
}

async function save() {
  if (v$.value.invalid) {
    return
  }

  if (!state.name || !state.categoryGroupId) return

  const groupCategories = categoryStore.all.filter(
    (category: any) => category.categoryGroupId === state.categoryGroupId
  )
  const category: Category = {
    name: state.name,
    categoryGroupId: state.categoryGroupId,
    sortOrder: groupCategories.length + 1,
    id: 0,
    spent: 0,
    available: 0,
    budget: 0,
  }
  const cat = await categoryStore.create(category)
  if (cat) {
    if (state.budget && cat) {
      const budget: Budget = {
        date: dateStore.date,
        assigned: state.budget,
        categoryId: cat.id,
      } as Budget
      await budgetStore.save(budget)
    }
    close()
  }
}
</script>
