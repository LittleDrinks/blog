// archive-quartz.js - 批量归档老文件到 Quartz 4 格式
async function archiveToQuartz() {
    // ==================== 配置区 ====================
    const targetFolder = "CS";  // 修改为你的文件夹名，如 "Blog" 或 "Posts"
    const dateFormat = "YYYY-MM-DDTHH:mm:ss";  // Quartz 4 兼容格式
    
    // ================================================
    
    const files = app.vault.getMarkdownFiles()
        .filter(f => f.path.startsWith(targetFolder + "/"));
    
    let processed = 0;
    let skipped = 0;
    
    for (const file of files) {
        try {
            // 获取文件系统创建时间（真实创建日期）
            const stat = await app.vault.adapter.stat(file.path);
            const creationDate = moment(stat.ctime).format(dateFormat);
            
            await app.fileManager.processFrontMatter(file, (fm) => {
                // 如果已有 date 字段且非空，跳过避免覆盖
                if (fm.date && String(fm.date).trim() !== "") {
                    skipped++;
                    return;
                }
                
                // 按照你要求的格式设置 frontmatter
                fm.title = fm.title || file.basename;  // 保留已有 title，无则用文件名
                fm.date = creationDate;                // 文件创建时间（核心！）
                fm.publish = true;                     // 设置为发布状态
                
                // 确保其他字段存在（初始化空值）
                if (!fm.hasOwnProperty('description')) fm.description = "";
                if (!fm.hasOwnProperty('tags')) fm.tags = [];
                if (!fm.hasOwnProperty('aliases')) fm.aliases = [];
                if (!fm.hasOwnProperty('publish')) fm.publish = true;
                
                processed++;
            });
            
        } catch (error) {
            console.error(`处理失败 ${file.path}:`, error);
        }
    }
    
    new Notice(`✅ 已归档 ${processed} 个文件 | ⏭️ 跳过 ${skipped} 个(已有date)`, 6000);
}

// 执行
archiveToQuartz();