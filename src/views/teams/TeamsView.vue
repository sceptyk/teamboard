<script setup lang="ts">
import { NButton, NSpace, NH1, NText, NList, NListItem, NThing, NEmpty } from 'naive-ui';
import { useCollection, useCurrentUser, useFirestore } from 'vuefire';
import { collection, query, where } from 'firebase/firestore';
import { ref, computed, watch } from 'vue';
import PageLayout from '@/components/layout/PageLayout.vue';
import CreateTeamModal from '@/views/teams/parts/CreateTeamModal.vue';
import type { Team } from '@/types/Team';
import StyledLink from '@/components/styled/StyledLink.vue';
import SkeletonListItem from '@/components/SkeletonListItem.vue';

const db = useFirestore();
const user = useCurrentUser();
const teamsSource = computed(() => {
  if (user.value) {
    return query(collection(db, 'teams'), where('members', 'array-contains-any', [user.value.uid]));
  }
  return undefined;
});
const { data: teams } = useCollection<Team>(teamsSource);

const isLoading = ref(true);
watch(teams, () => (isLoading.value = false));

const isCreateModalVisible = ref(false);

const openModal = () => {
  isCreateModalVisible.value = true;
};
</script>

<template>
  <page-layout>
    <template #content>
      <n-list v-if="teams.length || isLoading" hoverable>
        <template #header>
          <n-space justify="space-between" align="center">
            <n-h1 style="margin-bottom: 0">
              <n-text type="primary"> Your teams </n-text>
            </n-h1>
            <n-button @click="openModal" type="primary">Create team</n-button>
          </n-space>
        </template>
        <template v-if="isLoading">
          <skeleton-list-item v-for="n in 3" :key="n" />
        </template>
        <template v-else>
          <n-list-item v-for="team in teams" :key="team.id">
            <n-thing :title="team.name"> Number of members: {{ team.members.length }} </n-thing>
            <template #suffix>
              <styled-link
                :to="{
                  name: 'TeamBoard',
                  params: { teamId: team.id },
                }"
                >Open team board</styled-link
              >
            </template>
          </n-list-item>
        </template>
      </n-list>
      <n-empty v-else description="No teams found">
        <template #extra>
          <n-button size="small" @click="openModal"> Create new team </n-button>
        </template>
      </n-empty>
    </template>
  </page-layout>
  <create-team-modal v-model:is-visible="isCreateModalVisible" />
</template>

<style scoped lang="scss"></style>
