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

  <EntityIOL :entityId="accountId" :label="label" :null-label="nullLabel"/>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script lang="ts">

import {computed, defineComponent, onBeforeUnmount, onMounted, PropType, watch} from "vue";
import EntityIOL from "@/components/values/link/EntityIOL.vue";
import {NetworkCache} from "@/utils/cache/NetworkCache";
import {NameQuery} from "@/utils/NameQuery";
import {LabelQuery} from "@/utils/LabelQuery";

export default defineComponent({
  name: "AccountIOL",
  components: {EntityIOL},
  props: {
    accountId: {
      type: String as PropType<string | null>,
      default: null
    },
    nullLabel: {
      type: String,
      default: null
    }
  },
  setup(props) {

    const labelQuery = new LabelQuery(computed(() => props.accountId))
    onMounted(() => labelQuery.mount())
    onBeforeUnmount(() => labelQuery.unmount())

    const nameQuery = new NameQuery(labelQuery)
    onMounted(() => nameQuery.mount())
    onBeforeUnmount(() => nameQuery.unmount())

    watch(nameQuery.label, () => {
      console.log("label for " + props.accountId +  " => " + nameQuery.label.value)
    })
    return {
      label: nameQuery.label,
    }
  }
})

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style/>
