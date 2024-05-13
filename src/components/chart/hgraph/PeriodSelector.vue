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
  <o-field>
    <o-select
        v-bind:model-value="periodOption"
        @update:model-value="periodOptionDidChange($event)">
      <option key="day" value="day"
              style="background-color: var(--h-theme-box-background-color)">
        Day
      </option>
      <option key="week" value="week"
              style="background-color: var(--h-theme-box-background-color)">
        Week
      </option>
      <option key="month" value="month"
              style="background-color: var(--h-theme-box-background-color)">
        Month
      </option>
      <option key="quarter" value="quarter"
              style="background-color: var(--h-theme-box-background-color)">
        Quarter
      </option>
      <option key="year" value="year"
              style="background-color: var(--h-theme-box-background-color)">
        Year
      </option>
      <option key="century" value="year"
              style="background-color: var(--h-theme-box-background-color)">
        Century
      </option>
    </o-select>
  </o-field>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script lang="ts">

import {defineComponent} from "vue";

export default defineComponent({
  components: {},
  props: {
    periodOption: {
      type: String,
      default: "day"
    }
  },
  setup(props, ctx) {
    const periodOptionDidChange = (newValue: string) => ctx.emit('update:periodOption', newValue)
    return {
      periodOptionDidChange
    }
  }
})

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      STYLE                                                      -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped/>
