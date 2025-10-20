const MetricCard = ({ metric }) => (
    <div className="flex flex-row bg-elem items-center rounded-2xl pl-5">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${metric.bgColor}`}>
            <metric.icon className={`w-20 h-20 ${metric.color}`} />
        </div>
        <div className="flex flex-col items-start p-4 bg-muted rounded-lg">
            <span className="text-3xl font-extrabold text-foreground mt-1">{metric.value}</span>
            <span className="text-lg text-muted-foreground">{metric.title}</span>
        </div>
    </div>
);

export default MetricCard