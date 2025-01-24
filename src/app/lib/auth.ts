export const authClient = {
  useSession: () => {
    return {
      isPending: true,
      error: null,
      data: { user: null },
    };
  },
};
