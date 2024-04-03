interface HeadingProps {
    title: string;
    description: string;
    emoji: string;
  }
 
export const Heading: React.FC<HeadingProps> = ({ title, description, emoji }
    ) => {
    return (
        <div>
            <h2 className="text-3xl font-bold tracking-tight">{title + emoji}</h2>
            <p className="text-sm text-muted-foreground">{description}</p>
        </div>
    );
};