// scripts/test_api_flow.mjs
// Real HTTP End-to-End API Scoping & Multi-Tenant Data Isolation Verification

const BASE_URL = process.env.API_URL || 'http://localhost:8000/api';

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    ...options.headers,
  };
  const res = await fetch(url, { ...options, headers });
  const data = await res.json().catch(() => null);
  return { status: res.status, ok: res.ok, data };
}

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`  ✓ ${message}`);
}

async function run() {
  console.log('====================================================');
  console.log(' CAMPUS EXCHANGE REAL API DATA ISOLATION TEST');
  console.log(' Base URL:', BASE_URL);
  console.log('====================================================\n');

  const timestamp = Date.now();
  const aliceEmail = `alice.${timestamp}@university.edu`;
  const bobEmail = `bob.${timestamp}@university.edu`;
  const freshEmail = `fresh.${timestamp}@university.edu`;
  const password = 'Password123!';

  // 1. Register Alice
  console.log('Step 1: Registering User A (Alice)...');
  const regAlice = await request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      name: 'Alice Student',
      email: aliceEmail,
      password: password,
      password_confirmation: password,
    }),
  });
  assert(regAlice.status === 201 || regAlice.status === 200, `Alice registration response status: ${regAlice.status}`);
  const aliceToken = regAlice.data.token || regAlice.data.data?.token;
  const aliceUser = regAlice.data.user || regAlice.data.data?.user;
  console.log(`  Alice Token: ${aliceToken ? 'Acquired' : 'Missing'}, User ID: ${aliceUser?.id}`);

  // 2. Register Bob
  console.log('\nStep 2: Registering User B (Bob)...');
  const regBob = await request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      name: 'Bob Student',
      email: bobEmail,
      password: password,
      password_confirmation: password,
    }),
  });
  assert(regBob.status === 201 || regBob.status === 200, `Bob registration response status: ${regBob.status}`);
  const bobToken = regBob.data.token || regBob.data.data?.token;
  const bobUser = regBob.data.user || regBob.data.data?.user;
  console.log(`  Bob Token: ${bobToken ? 'Acquired' : 'Missing'}, User ID: ${bobUser?.id}`);

  // 3. Register Fresh Student
  console.log('\nStep 3: Registering User C (Fresh Account)...');
  const regFresh = await request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      name: 'Fresh Student',
      email: freshEmail,
      password: password,
      password_confirmation: password,
    }),
  });
  assert(regFresh.status === 201 || regFresh.status === 200, `Fresh registration response status: ${regFresh.status}`);
  const freshToken = regFresh.data.token || regFresh.data.data?.token;
  const freshUser = regFresh.data.user || regFresh.data.data?.user;
  console.log(`  Fresh Token: ${freshToken ? 'Acquired' : 'Missing'}, User ID: ${freshUser?.id}`);

  // 4. Fetch Categories
  const catRes = await request('/categories');
  assert(catRes.ok && catRes.data.data?.length > 0, 'Categories retrieved');
  const categoryId = catRes.data.data[0].id;

  // 5. Alice creates 2 products
  console.log('\nStep 4: Alice creates 2 listings...');
  const prodA1 = await request('/products', {
    method: 'POST',
    headers: { Authorization: `Bearer ${aliceToken}` },
    body: JSON.stringify({
      name: 'Alice Calculus Textbook',
      description: 'Calculus Early Transcendentals 9th Edition in mint condition',
      price: 50,
      category_id: categoryId,
      condition: 'Good',
      location: 'Main Library',
      contact_information: aliceEmail,
    }),
  });
  if (!prodA1.ok) {
    console.error('Product 1 Creation Error:', prodA1.status, prodA1.data);
  }
  assert(prodA1.ok, `Alice Product 1 created (ID: ${prodA1.data?.data?.id})`);

  const prodA2 = await request('/products', {
    method: 'POST',
    headers: { Authorization: `Bearer ${aliceToken}` },
    body: JSON.stringify({
      name: 'Alice Scientific Calculator',
      description: 'Casio FX-991EX Classwiz with solar battery',
      price: 25,
      category_id: categoryId,
      condition: 'Like New',
      location: 'Student Center',
      contact_information: aliceEmail,
    }),
  });
  assert(prodA2.ok, `Alice Product 2 created (ID: ${prodA2.data.data?.id})`);

  // 6. Bob creates 1 product
  console.log('\nStep 5: Bob creates 1 listing...');
  const prodB1 = await request('/products', {
    method: 'POST',
    headers: { Authorization: `Bearer ${bobToken}` },
    body: JSON.stringify({
      name: 'Bob Desk Lamp',
      description: 'LED adjustable study desk lamp with USB charging port',
      price: 20,
      category_id: categoryId,
      condition: 'Like New',
      location: 'North Hall',
      contact_information: bobEmail,
    }),
  });
  assert(prodB1.ok, `Bob Product 1 created (ID: ${prodB1.data.data?.id})`);
  const bobProdId = prodB1.data.data.id;

  // 7. Alice sends purchase request to Bob
  console.log('\nStep 6: Alice sends purchase request for Bob\'s product...');
  const reqAtoB = await request(`/products/${bobProdId}/requests`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${aliceToken}` },
    body: JSON.stringify({
      message: 'Hi Bob, is this lamp still available for pickup tonight?',
    }),
  });
  assert(reqAtoB.ok, `Purchase request created (ID: ${reqAtoB.data.data?.id})`);

  // 8. Alice favorites Bob's product
  console.log('\nStep 7: Alice favorites Bob\'s product...');
  const favA = await request(`/products/${bobProdId}/favorite`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${aliceToken}` },
  });
  assert(favA.ok, 'Favorite added by Alice');

  // 9. Alice starts a conversation with Bob
  console.log('\nStep 8: Alice creates a conversation with Bob...');
  const convAtoB = await request('/conversations', {
    method: 'POST',
    headers: { Authorization: `Bearer ${aliceToken}` },
    body: JSON.stringify({
      product_id: bobProdId,
      user_two_id: bobUser.id,
    }),
  });
  assert(convAtoB.ok, `Conversation created (ID: ${convAtoB.data.data?.id})`);

  // =========================================================
  // VERIFICATION SUITE 1: FRESH ACCOUNT ISOLATION (User C)
  // =========================================================
  console.log('\n========================================================');
  console.log(' VERIFICATION SUITE 1: Fresh Account Invariants (User C)');
  console.log('========================================================');

  const freshMine = await request('/products/mine', { headers: { Authorization: `Bearer ${freshToken}` } });
  if (!freshMine.ok) {
    console.error('Fresh /products/mine failed:', freshMine.status, freshMine.data);
  }
  const freshMineItems = freshMine.data?.data || freshMine.data || [];
  assert(freshMine.ok && Array.isArray(freshMineItems) && freshMineItems.length === 0, `Fresh user /products/mine count: ${freshMineItems.length} (Expected: 0)`);

  const freshSent = await request('/requests/sent', { headers: { Authorization: `Bearer ${freshToken}` } });
  const freshSentItems = freshSent.data?.data || freshSent.data || [];
  assert(freshSent.ok && Array.isArray(freshSentItems) && freshSentItems.length === 0, `Fresh user /requests/sent count: ${freshSentItems.length} (Expected: 0)`);

  const freshRecv = await request('/requests/received', { headers: { Authorization: `Bearer ${freshToken}` } });
  const freshRecvItems = freshRecv.data?.data || freshRecv.data || [];
  assert(freshRecv.ok && Array.isArray(freshRecvItems) && freshRecvItems.length === 0, `Fresh user /requests/received count: ${freshRecvItems.length} (Expected: 0)`);

  const freshConv = await request('/conversations', { headers: { Authorization: `Bearer ${freshToken}` } });
  const freshConvItems = freshConv.data?.data || freshConv.data || [];
  assert(freshConv.ok && Array.isArray(freshConvItems) && freshConvItems.length === 0, `Fresh user /conversations count: ${freshConvItems.length} (Expected: 0)`);

  const freshFav = await request('/favorites', { headers: { Authorization: `Bearer ${freshToken}` } });
  const freshFavItems = freshFav.data?.data || freshFav.data || [];
  assert(freshFav.ok && Array.isArray(freshFavItems) && freshFavItems.length === 0, `Fresh user /favorites count: ${freshFavItems.length} (Expected: 0)`);

  // =========================================================
  // VERIFICATION SUITE 2: MULTI-TENANT DATA ISOLATION (Alice vs Bob)
  // =========================================================
  console.log('\n========================================================');
  console.log(' VERIFICATION SUITE 2: Multi-Tenant Data Isolation (Alice vs Bob)');
  console.log('========================================================');

  // Alice checks
  const aliceMine = await request('/products/mine', { headers: { Authorization: `Bearer ${aliceToken}` } });
  const aliceMineItems = aliceMine.data?.data || aliceMine.data || [];
  assert(aliceMine.ok && aliceMineItems.length === 2, `Alice /products/mine: ${aliceMineItems.length} (Expected: 2)`);

  const aliceSent = await request('/requests/sent', { headers: { Authorization: `Bearer ${aliceToken}` } });
  const aliceSentItems = aliceSent.data?.data || aliceSent.data || [];
  assert(aliceSent.ok && aliceSentItems.length === 1, `Alice /requests/sent: ${aliceSentItems.length} (Expected: 1)`);

  const aliceRecv = await request('/requests/received', { headers: { Authorization: `Bearer ${aliceToken}` } });
  const aliceRecvItems = aliceRecv.data?.data || aliceRecv.data || [];
  assert(aliceRecv.ok && aliceRecvItems.length === 0, `Alice /requests/received: ${aliceRecvItems.length} (Expected: 0)`);

  const aliceConv = await request('/conversations', { headers: { Authorization: `Bearer ${aliceToken}` } });
  const aliceConvItems = aliceConv.data?.data || aliceConv.data || [];
  assert(aliceConv.ok && aliceConvItems.length === 1, `Alice /conversations: ${aliceConvItems.length} (Expected: 1)`);

  const aliceFav = await request('/favorites', { headers: { Authorization: `Bearer ${aliceToken}` } });
  const aliceFavItems = aliceFav.data?.data || aliceFav.data || [];
  assert(aliceFav.ok && aliceFavItems.length === 1, `Alice /favorites: ${aliceFavItems.length} (Expected: 1)`);

  // Bob checks
  const bobMine = await request('/products/mine', { headers: { Authorization: `Bearer ${bobToken}` } });
  const bobMineItems = bobMine.data?.data || bobMine.data || [];
  assert(bobMine.ok && bobMineItems.length === 1, `Bob /products/mine: ${bobMineItems.length} (Expected: 1)`);

  const bobSent = await request('/requests/sent', { headers: { Authorization: `Bearer ${bobToken}` } });
  const bobSentItems = bobSent.data?.data || bobSent.data || [];
  assert(bobSent.ok && bobSentItems.length === 0, `Bob /requests/sent: ${bobSentItems.length} (Expected: 0)`);

  const bobRecv = await request('/requests/received', { headers: { Authorization: `Bearer ${bobToken}` } });
  const bobRecvItems = bobRecv.data?.data || bobRecv.data || [];
  assert(bobRecv.ok && bobRecvItems.length === 1, `Bob /requests/received: ${bobRecvItems.length} (Expected: 1)`);

  const bobConv = await request('/conversations', { headers: { Authorization: `Bearer ${bobToken}` } });
  const bobConvItems = bobConv.data?.data || bobConv.data || [];
  assert(bobConv.ok && bobConvItems.length === 1, `Bob /conversations: ${bobConvItems.length} (Expected: 1)`);

  const bobFav = await request('/favorites', { headers: { Authorization: `Bearer ${bobToken}` } });
  const bobFavItems = bobFav.data?.data || bobFav.data || [];
  assert(bobFav.ok && bobFavItems.length === 0, `Bob /favorites: ${bobFavItems.length} (Expected: 0)`);

  console.log('\n========================================================');
  console.log(' 🎉 ALL DATA INTEGRITY & ISOLATION TESTS PASSED 100%!');
  console.log('========================================================\n');
}

run().catch((err) => {
  console.error('Test Execution Error:', err);
  process.exit(1);
});
