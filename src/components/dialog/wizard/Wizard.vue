<!--
  -
  - Hedera Mirror Node Explorer
  -
  - Copyright (C) 2021 - 2024 Hedera Hashgraph, LLC
  -
  - Licensed under the Apache License, Version 2.0 (the "License");
  - you may not use this file except in compliance with the License.
  - You may obtain a copy of the License at
  -
  -      http://www.apache.org/licenses/LICENSE-2.0
  -
  - Unless required by applicable law or agreed to in writing, software
  - distributed under the License is distributed on an "AS IS" BASIS,
  - WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  - See the License for the specific language governing permissions and
  - limitations under the License.
  -
  -->


<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <Dialog :controller="controller">
    <template #dialogTitle>
      <slot name="wizardTitle"/>
    </template>
    <template #dialogInput>
      <div class="dialog-stack mb-4">
        <div v-if="$slots.wizardStep1" :class="{'is-invisible': currentStep != 1}">
          <slot name="wizardStep1"/>
        </div>
        <div v-if="$slots.wizardStep2"  :class="{'is-invisible': currentStep != 2}">
          <slot name="wizardStep2"/>
        </div>
        <div v-if="$slots.wizardStep3"  :class="{'is-invisible': currentStep != 3}">
          <slot name="wizardStep3"/>
        </div>
        <div v-if="$slots.wizardStep4"  :class="{'is-invisible': currentStep != 4}">
          <slot name="wizardStep4"/>
        </div>
        <div v-if="$slots.wizardStep5"  :class="{'is-invisible': currentStep != 5}">
          <slot name="wizardStep5"/>
        </div>
        <div v-if="$slots.wizardStep6"  :class="{'is-invisible': currentStep != 6}">
          <slot name="wizardStep6"/>
        </div>
        <div v-if="$slots.wizardStep7"  :class="{'is-invisible': currentStep != 7}">
          <slot name="wizardStep7"/>
        </div>
        <div v-if="$slots.wizardStep8"  :class="{'is-invisible': currentStep != 8}">
          <slot name="wizardStep8"/>
        </div>
      </div>
    </template>
    <template #dialogInputButtons>
      <DialogButton :controller="controller"
                    :auto-close="false"
                    :enabled="backEnabled"
                    :invisible="backButtonInvisible"
                    @action="handleBack">{{ backButtonTitle }}</DialogButton>
      <DialogButton :controller="controller"
                    :auto-close="false"
                    :enabled="nextEnabled"
                    @action="handleNext">{{ nextButtonTitle }}</DialogButton>
    </template>
  </Dialog>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {DialogController} from "@/components/dialog/DialogController";
import Dialog from "@/components/dialog/Dialog.vue";
import DialogButton from "@/components/dialog/DialogButton.vue";
import {WizardState} from "@/components/dialog/wizard/WizardState";
import {computed, PropType, ref, useSlots} from "vue";


//
// Props
//

const state = defineModel('state', { type: Object as PropType<WizardState>, required: true })
const visible = defineModel('visible', { type: Boolean, default: true })
const currentStep = defineModel('currentStep', { type: Number, default: 1})
const controller = new DialogController(visible)


//
// Back / Next
//

const backEnabled = computed(() => {
  const indexOK = 1 <= currentStep.value && currentStep.value < lastStepIndex
  const stateOK = state.value.backEnabled(currentStep.value)
  return indexOK && stateOK && !movingToNext.value
})

const nextEnabled = computed(() => {
  const indexOK = currentStep.value <= lastStepIndex
  const stateOK = currentStep.value == lastStepIndex || state.value.nextEnabled(currentStep.value)
  return indexOK && stateOK && !movingToNext.value
})

const backButtonInvisible = computed(() => {
  return currentStep.value == lastStepIndex
})

const backButtonTitle = computed(() => {
  return currentStep.value == 1 ? "Cancel" : "Back"
})

const nextButtonTitle = computed(() => {
  return currentStep.value < lastStepIndex ? "Next" : "Close"
})

const handleBack = () => {
  currentStep.value -= 1
  if (currentStep.value > 1) {
    currentStep.value -= 1
  } else {
    visible.value = false
  }
}

const movingToNext = ref<boolean>(false)

const handleNext = async () => {
  if (currentStep.value === lastStepIndex) {
    visible.value = false
  } else {
    movingToNext.value = true
    try {
      if (await state.value.moveToNext(currentStep.value)) {
        currentStep.value += 1
      }
    } finally {
      movingToNext.value = false
    }
  }
}

const computeLastStepIndex = () => {
  let result = 0
  const maxStepCount = 8
  const slots = useSlots()
  for (let i = 1; i <= maxStepCount; i += 1) {
    if ("wizardStep" + i in slots) {
      result = i
    }
  }
  return result
}
const lastStepIndex = computeLastStepIndex()

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      STYLE                                                      -->
<!-- --------------------------------------------------------------------------------------------------------------- -->


<style scoped>
.dialog-stack {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  justify-items: stretch;
}

.dialog-stack div {
  grid-column-start: 1;
  grid-row-start: 1
}

</style>
