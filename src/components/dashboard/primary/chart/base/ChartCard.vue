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
    <DashboardCard>
        <template v-slot:title>
            <slot name="chartTitle"/>
        </template>
        <template v-slot:control>
            <slot name="chartControl"/>
        </template>
        <template v-slot:content>
            <div ref="container" style="height:300px"/>
        </template>
    </DashboardCard>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script lang="ts">

//
// https://www.amcharts.com/docs/v5/getting-started/integrations/vue/
//

import {defineComponent, PropType} from "vue"
import DashboardCard from "@/components/DashboardCard.vue";
import {ChartController} from "@/components/dashboard/primary/chart/base/ChartController";

export default defineComponent({
    components: {DashboardCard},
    props: {
        controller: {
            type: Object as PropType<ChartController>,
            required: true
        }
    },
    setup(props) {
        return {
            container: props.controller.container
        }
    }
})

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      STYLE                                                      -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped/>
