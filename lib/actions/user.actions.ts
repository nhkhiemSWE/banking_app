'use server'

export const signIn = async () => {
  try {
    
    return { success: 'Sign in successful' };
  } catch (error) {
    console.error(error);
    return { error: 'Failed to sign in' };
  }
}

export const signUp = async (data: SignUpParams) => {
  try {
    console.log(data);
    return { success: 'Sign up successful' };
  } catch (error) {
    console.error(error);
    return { error: 'Failed to sign up' };
  }
}