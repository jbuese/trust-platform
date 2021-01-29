<template>
  <section>
    <div class="level">
      <div class="column">
        <b-field>
          <b-input
            placeholder="Suche nach Service, Anbieter oder Version"
            v-model.lazy="searchQuery"
          />
        </b-field>
      </div>
      <h1 v-if="isAdmin" class="pr-3">|</h1>
      <b-button v-if="isAdmin" icon-left="upload" @click="launchServiceCreatorModal()"
        >Neuen Service hinzufügen</b-button
      >
    </div>
    <h1 class="pt-5" v-if="data.length == 0">Keine Services verfügbar!</h1>
    <div v-else class="container">
      <b-table
        hoverable
        aria-next-label="Next page"
        aria-previous-label="Previous page"
        aria-page-label="Page"
        aria-current-label="Current page"
        :data="filter"
        :paginated="true"
        :per-page="this.computePageSize"
        :current-page.sync="currentPage"
        :pagination-position="paginationPosition"
        @click="(row) => launchServiceInfoModal(row)"
      >
        <b-table-column
          class="ta"
          field="name"
          label="Service"
          v-slot="props"
          :width="550"
        >
          <div class="ta">{{ props.row.name }}</div>
        </b-table-column>

        <b-table-column field="creator" label="Anbieter" v-slot="props">
          <div class="ta">{{ props.row.creator }}</div>
        </b-table-column>

        <b-table-column
          field="version"
          label="Version"
          centered
          v-slot="props"
          :width="100"
        >
          <b-tag type="is-info">{{ props.row.version }}</b-tag>
        </b-table-column>

        <b-table-column field="" centered v-slot="props" :width="50">
          <div v-on:click="launchServiceInfoModal(props.row)">
            <b-tooltip
              multilined
              type="is-light"
              label="Mehr über diesen Service erfahren"
            >
              <b-icon class="zoom" icon="information-outline"></b-icon>
            </b-tooltip>
          </div>
        </b-table-column>

        <b-modal v-model="isInfoModalActive" :width="600">
          <service-info-component v-bind:service-element="modalInformation">
          </service-info-component>
        </b-modal>

        <b-modal v-model="isCreatorModalActive" :width="600">
          <service-creator-component></service-creator-component>
        </b-modal>
      </b-table>
    </div>
  </section>
</template>

<script>
const data = require("@/data/sampleService.json");
import ServiceInfoComponent from "@/components/ServiceInfoComponent";
import ServiceCreatorComponent from "./ServiceCreatorComponent.vue";

export default {
  name: "ServiceExplorer",
  data() {
    return {
      // table data + settings
      data,
      paginationPosition: "bottom",
      currentPage: 1,
      perPage: 8,

      // modal config + search query
      isCreatorModalActive: false,
      isInfoModalActive: false,
      modalInformation: {},
      searchQuery: "",
    };
  },
  components: {
    ServiceInfoComponent,
    ServiceCreatorComponent,
  },
  computed: {
    /**
     * Returns the username.
     *
     * @returns {String} The username.
     */
    username() {
      return this.$store.state.username;
    },
    /**
     * Returns if the user is admin or not
     *
     * @returns {Boolean} True if the current user is admin.
     */
    isAdmin() {
      return this.$store.state.isAdmin;
    },
    /**
     * Computes the per-page for the table depending on the screen size.
     *
     * @returns {5|8} The per-page num that should be used.
     */
    computePageSize() {
      if (window.matchMedia("(max-width: 1200px)").matches) {
        console.log("below max-width - reducing size");
        return 5;
      } else {
        return 8;
      }
    },
    /**
     * Filters the data with the searchQuery.
     * Searchable: name, creator and version
     *
     * @returns A list containing the matching data
     */
    filter() {
      var name_re = new RegExp(this.searchQuery, "i");
      var dataFiltered = [];
      for (var i in this.data) {
        if (
          this.data[i].name.match(name_re) ||
          this.data[i].creator.match(name_re) ||
          this.data[i].version.match(name_re)
        ) {
          dataFiltered.push(this.data[i]);
        }
      }
      return dataFiltered;
    },
  },
  methods: {
    /**
     * Launches the service info modal.
     */
    launchServiceInfoModal(row) {
      this.modalInformation = row;
      this.isInfoModalActive = true;
    },
    /**
     * Launches the service creator modal.
     */
    launchServiceCreatorModal() {
      this.isCreatorModalActive = true;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.b-table .level:not(.top) {
  padding-bottom: 0rem;
}

.zoom {
  cursor: pointer;
  transition: all 0.25s ease;

  &:hover {
    transform: scale(1.07);
  }
}

.ta {
  text-align: left;
}
</style>