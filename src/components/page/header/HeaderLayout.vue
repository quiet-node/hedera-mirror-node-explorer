<!--
  -
  - Hedera Mirror Node Explorer
  -
  - Copyright (C) 2021 - 2023 Hedera Hashgraph, LLC
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
  <div id="container">
    <div style="grid-area: product_logo">
      <slot name="productLogo">
        <div style="background: blue; height: 100%">productLogo</div>
      </slot>
    </div>
    <div style="grid-area: tab_bar">
      <slot name="tabBar">
        <div style="background: red">tabBar</div>
      </slot>
    </div>
    <div style="grid-area: search_bar">
      <slot name="searchBar">
        <div style="background: white;color: black">searchBar</div>
      </slot>
    </div>
    <div style="grid-area: network_selector">
      <slot name="networkSelector">
        <div style="background: yellow;color: black; width:180px">networkSelector</div>
      </slot>
    </div>
    <div style="grid-area: connect_button">
      <slot name="connectButton">
        <div style="background: green; width: 150px">connectButton</div>
      </slot>
    </div>
  </div>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

#container {
  display: grid;
  grid-template-columns: min-content auto min-content min-content;
  grid-template-rows: min-content min-content 1px;
  grid-template-areas:
    "product_logo tab_bar tab_bar tab_bar"
    "product_logo search_bar network_selector connect_button"
    "product_logo . . .";
  column-gap: 20px;
}

</style>
