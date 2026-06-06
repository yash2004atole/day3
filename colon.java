class colon{
    public static void main(String[] args) {
        Scanner sc=new Scanner(System.in);
        System.out.println("Enter your name");
        String name=sc.next();
        String rev="";
        for(int i=name.length()-1;i>=0;i--)
        {
            System.out.println(name.charAt(i));
        }
        sc.close();
    }
}