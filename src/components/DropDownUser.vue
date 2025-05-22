 <template>
 <div>
  <q-btn-dropdown
   :label="user != null ? user.email : ''"
   color="white"
   push
   flat
   no-caps
   icon="account_circle"
   class="gt-xs"
  >
   <q-list>
    <q-item clickable v-close-popup @click="funAltera" class="text-primary">
     <q-item-section>
      <q-item-label>Alterar Senha</q-item-label>
     </q-item-section>
     <q-item-section side>
      <q-icon name="lock_reset" color="primary" />
     </q-item-section>
    </q-item>

    <q-item clickable v-close-popup @click="funSair" class="bg-primary text-white">
     <q-item-section>
      <q-item-label>Sair</q-item-label>
     </q-item-section>
     <q-item-section side>
      <q-icon name="logout" color="white" />
     </q-item-section>
    </q-item>
   </q-list>
  </q-btn-dropdown>

  <q-btn-dropdown
   color="white"
   push
   flat
   no-caps
   fab
   icon="account_circle"
   class="lt-sm"
  >
   <q-list>
    <q-item clickable v-close-popup @click="funAltera" class="text-primary">
     <q-item-section>
      <q-item-label>Alterar Senha</q-item-label>
     </q-item-section>
     <q-item-section side>
      <q-icon name="lock_reset" color="primary" />
     </q-item-section>
    </q-item>

    <q-item clickable v-close-popup @click="funSair" class="bg-primary text-white">
     <q-item-section>
      <q-item-label>Sair</q-item-label>
     </q-item-section>
     <q-item-section side>
      <q-icon name="logout" color="white" />
     </q-item-section>
    </q-item>
   </q-list>
  </q-btn-dropdown>
 </div>
</template>
 
 <script>
export default {
 props: {
  user: null,
  funAltera: null,
  funSair: null,
 },
};
</script>
 
 <style>
</style>