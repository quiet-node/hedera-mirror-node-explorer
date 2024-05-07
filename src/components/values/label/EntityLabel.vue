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

  <div class="is-inline-block">

    <template v-if="label !== null">
      <span class="h-is-label">
        {{ label }}
      </span>
    </template>

    <template v-else>
      <!-- Nothing because label is null -->
    </template>

  </div>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script lang="ts">

import {computed, defineComponent, PropType} from "vue";

export const MAX_LABEL_SIZE = 35

export default defineComponent({

  name: "EntityLabel",

  props: {
    label: {
      type: String as PropType<string | null>,
      default: null
    },
    slice: {
      type: Number as PropType<number | null>,
      default: MAX_LABEL_SIZE
    },
  },

  setup(props) {
    const label = computed(() => {
      let result = props.label
      if (result != null
          && props.slice != null
          && props.slice > 0
          && props.slice < result.length) {
        result = result.slice(0, props.slice) + '…'
      }
      return result
    })

    return {
      label,
    }
  }

})
</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style/>
