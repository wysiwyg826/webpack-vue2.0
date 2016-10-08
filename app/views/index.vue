<style scoped lang="scss">
	li{
		list-style:none;
	}
	.node {
		width: 12px;
	}
</style>
<template>
  <div>
    <ul>
      <li v-for="(item, index) in list">
        <span v-if="index < 3">**</span>{{item.name}}
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  data: () => ({
    list: [{
      id: 1,
      name: "first"
    }, {
      id: 2,
      name: "second"
    }, {
      id: 3,
      name: "third"
    }, {
      id: 4,
      name: "forth"
    }]
  }),
  created: function() {
    console.log(123);
  }
}
</script>


