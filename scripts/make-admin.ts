import { db } from '../src/lib/db';
import { users } from '../src/drizzle.schema';
import { eq } from 'drizzle-orm';

async function makeAdmin() {
  try {
    console.log('Updating twinwicksllc@gmail.com to admin role...');
    
    const result = await db
      .update(users)
      .set({ role: 'admin' })
      .where(eq(users.email, 'twinwicksllc@gmail.com'))
      .returning();

    if (result.length > 0) {
      console.log('✅ Successfully updated user to admin:', result[0]);
    } else {
      console.log('❌ User not found with email: twinwicksllc@gmail.com');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating user role:', error);
    process.exit(1);
  }
}

makeAdmin();