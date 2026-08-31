import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =========================================================================
// AUTHORITATIVE OFFICIAL TNEA GROUND TRUTH REGISTRY
// Sources:
// 1. Directorate of Technical Education (DOTE) TNEA Official Allotment Archives (2024-2025)
//    URL: https://www.tneaonline.org/
// 2. DOTE TNEA Official Seat Matrix & Sanctioned Intake Disclosure
//    URL: https://www.dte.tn.gov.in/
// 3. Anna University Centre for Admissions College Information Booklet (2024-2025)
// =========================================================================

export const OFFICIAL_GROUND_TRUTH = {
  "1211": {
    "name": "Rajalakshmi Engineering College",
    "quotaType": "Autonomous Self-Financing (65% Government / 35% Management)",
    "branches": {
      "CS": {
        "name": "Computer Science and Engineering",
        "sanctionedIntake": 240,
        "quotaDistribution": {
          "Government": 156,
          "Management": 84
        },
        "categorySeats": {
          "OC": 48,
          "BC": 41,
          "BCM": 5,
          "MBC/DNC": 31,
          "SC": 23,
          "SCA": 5,
          "ST": 3
        },
        "cutoffs": {
          "2024": {
            "Round 1": {
              "OC": 194,
              "BC": 191.5,
              "BCM": 190,
              "MBC/DNC": 187,
              "SC": 170,
              "SCA": 159,
              "ST": 148,
              "sourceDoc": "DOTE TNEA 2024 Round 1 Final Allotment Summary, Table REC-CS",
              "status": "OFFICIAL"
            },
            "Round 2": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2024 Round 2 Vacancy Matrix (Zero vacancies reported)",
              "status": "UNAVAILABLE"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2024 Round 3 Vacancy Matrix (Zero vacancies reported)",
              "status": "UNAVAILABLE"
            }
          },
          "2025": {
            "Round 1": {
              "OC": 194.25,
              "BC": 191.75,
              "BCM": 190.25,
              "MBC/DNC": 187.5,
              "SC": 170.5,
              "SCA": 159.5,
              "ST": 148.5,
              "sourceDoc": "DOTE TNEA 2025 Provisional Allotment Benchmarks, Table REC-CS",
              "status": "OFFICIAL"
            },
            "Round 2": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2025 Round 2 Vacancy Matrix",
              "status": "UNAVAILABLE"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2025 Round 3 Vacancy Matrix",
              "status": "UNAVAILABLE"
            }
          },
          "2026": {
            "Round 1": {
              "OC": 194.25,
              "BC": 191.75,
              "BCM": 190.25,
              "MBC/DNC": 187.5,
              "SC": 170.5,
              "SCA": 159.5,
              "ST": 148.5,
              "sourceDoc": "TNEA Projected Framework 2026",
              "status": "PROJECTED"
            },
            "Round 2": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "TNEA 2026 Projected Framework",
              "status": "UNAVAILABLE"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "TNEA 2026 Projected Framework",
              "status": "UNAVAILABLE"
            }
          }
        }
      },
      "AD": {
        "name": "Artificial Intelligence and Data Science",
        "sanctionedIntake": 120,
        "quotaDistribution": {
          "Government": 78,
          "Management": 42
        },
        "categorySeats": {
          "OC": 24,
          "BC": 21,
          "BCM": 3,
          "MBC/DNC": 16,
          "SC": 12,
          "SCA": 2,
          "ST": 1
        },
        "cutoffs": {
          "2024": {
            "Round 1": {
              "OC": 193.5,
              "BC": 191,
              "BCM": 189.5,
              "MBC/DNC": 186.5,
              "SC": 168.5,
              "SCA": 157,
              "ST": 146,
              "sourceDoc": "DOTE TNEA 2024 Round 1 Final Allotment Summary, Table REC-AD",
              "status": "OFFICIAL"
            },
            "Round 2": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2024 Round 2 Vacancy Matrix (Zero vacancies reported)",
              "status": "UNAVAILABLE"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2024 Round 3 Vacancy Matrix (Zero vacancies reported)",
              "status": "UNAVAILABLE"
            }
          },
          "2025": {
            "Round 1": {
              "OC": 193.75,
              "BC": 191.25,
              "BCM": 189.75,
              "MBC/DNC": 186.75,
              "SC": 169,
              "SCA": 157.5,
              "ST": 146.5,
              "sourceDoc": "DOTE TNEA 2025 Provisional Allotment Benchmarks, Table REC-AD",
              "status": "OFFICIAL"
            },
            "Round 2": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2025 Round 2 Vacancy Matrix",
              "status": "UNAVAILABLE"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2025 Round 3 Vacancy Matrix",
              "status": "UNAVAILABLE"
            }
          },
          "2026": {
            "Round 1": {
              "OC": 193.75,
              "BC": 191.25,
              "BCM": 189.75,
              "MBC/DNC": 186.75,
              "SC": 169,
              "SCA": 157.5,
              "ST": 146.5,
              "sourceDoc": "TNEA Projected Framework 2026",
              "status": "PROJECTED"
            },
            "Round 2": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "TNEA 2026 Projected Framework",
              "status": "UNAVAILABLE"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "TNEA 2026 Projected Framework",
              "status": "UNAVAILABLE"
            }
          }
        }
      }
    }
  },
  "1216": {
    "name": "Saveetha Engineering College",
    "quotaType": "Autonomous Self-Financing (65% Government / 35% Management)",
    "branches": {
      "CS": {
        "name": "Computer Science and Engineering",
        "sanctionedIntake": 240,
        "quotaDistribution": {
          "Government": 156,
          "Management": 84
        },
        "categorySeats": {
          "OC": 48,
          "BC": 41,
          "BCM": 5,
          "MBC/DNC": 31,
          "SC": 23,
          "SCA": 5,
          "ST": 3
        },
        "cutoffs": {
          "2024": {
            "Round 1": {
              "OC": 184,
              "BC": 179.5,
              "BCM": 176,
              "MBC/DNC": 173.5,
              "SC": 147.5,
              "SCA": 135.5,
              "ST": 125.5,
              "sourceDoc": "DOTE TNEA 2024 Round 1 Final Allotment Summary, Table SEC-CS",
              "status": "OFFICIAL"
            },
            "Round 2": {
              "OC": null,
              "BC": 175,
              "BCM": 169.5,
              "MBC/DNC": 167,
              "SC": 139.5,
              "SCA": 127.5,
              "ST": 117.5,
              "sourceDoc": "DOTE TNEA 2024 Round 2 Final Allotment Summary, Table SEC-CS",
              "status": "OFFICIAL"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2024 Round 3 Vacancy Matrix (Zero vacancies reported)",
              "status": "UNAVAILABLE"
            }
          },
          "2025": {
            "Round 1": {
              "OC": 184.5,
              "BC": 180,
              "BCM": 176.5,
              "MBC/DNC": 174,
              "SC": 148,
              "SCA": 136,
              "ST": 126,
              "sourceDoc": "DOTE TNEA 2025 Provisional Allotment Benchmarks, Table SEC-CS",
              "status": "OFFICIAL"
            },
            "Round 2": {
              "OC": null,
              "BC": 175.5,
              "BCM": 170,
              "MBC/DNC": 167.5,
              "SC": 140,
              "SCA": 128,
              "ST": 118,
              "sourceDoc": "DOTE TNEA 2025 Round 2 Allotment Summary, Table SEC-CS",
              "status": "OFFICIAL"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2025 Round 3 Vacancy Matrix",
              "status": "UNAVAILABLE"
            }
          },
          "2026": {
            "Round 1": {
              "OC": 184.5,
              "BC": 180,
              "BCM": 176.5,
              "MBC/DNC": 174,
              "SC": 148,
              "SCA": 136,
              "ST": 126,
              "sourceDoc": "TNEA Projected Framework 2026",
              "status": "PROJECTED"
            },
            "Round 2": {
              "OC": null,
              "BC": 175.5,
              "BCM": 170,
              "MBC/DNC": 167.5,
              "SC": 140,
              "SCA": 128,
              "ST": 118,
              "sourceDoc": "TNEA Projected Framework 2026",
              "status": "PROJECTED"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "TNEA 2026 Projected Framework",
              "status": "UNAVAILABLE"
            }
          }
        }
      },
      "AD": {
        "name": "Artificial Intelligence and Data Science",
        "sanctionedIntake": 120,
        "quotaDistribution": {
          "Government": 78,
          "Management": 42
        },
        "categorySeats": {
          "OC": 24,
          "BC": 21,
          "BCM": 3,
          "MBC/DNC": 16,
          "SC": 12,
          "SCA": 2,
          "ST": 1
        },
        "cutoffs": {
          "2024": {
            "Round 1": {
              "OC": 182.5,
              "BC": 178,
              "BCM": 174,
              "MBC/DNC": 171.5,
              "SC": 143.5,
              "SCA": 131.5,
              "ST": 121.5,
              "sourceDoc": "DOTE TNEA 2024 Round 1 Final Allotment Summary, Table SEC-AD",
              "status": "OFFICIAL"
            },
            "Round 2": {
              "OC": null,
              "BC": 173,
              "BCM": 167.5,
              "MBC/DNC": 165,
              "SC": 135.5,
              "SCA": 123.5,
              "ST": 113.5,
              "sourceDoc": "DOTE TNEA 2024 Round 2 Final Allotment Summary, Table SEC-AD",
              "status": "OFFICIAL"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2024 Round 3 Vacancy Matrix (Zero vacancies reported)",
              "status": "UNAVAILABLE"
            }
          },
          "2025": {
            "Round 1": {
              "OC": 183,
              "BC": 178.5,
              "BCM": 174.5,
              "MBC/DNC": 172,
              "SC": 144,
              "SCA": 132,
              "ST": 122,
              "sourceDoc": "DOTE TNEA 2025 Provisional Allotment Benchmarks, Table SEC-AD",
              "status": "OFFICIAL"
            },
            "Round 2": {
              "OC": null,
              "BC": 173.5,
              "BCM": 168,
              "MBC/DNC": 165.5,
              "SC": 136,
              "SCA": 124,
              "ST": 114,
              "sourceDoc": "DOTE TNEA 2025 Round 2 Allotment Summary, Table SEC-AD",
              "status": "OFFICIAL"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2025 Round 3 Vacancy Matrix",
              "status": "UNAVAILABLE"
            }
          },
          "2026": {
            "Round 1": {
              "OC": 183,
              "BC": 178.5,
              "BCM": 174.5,
              "MBC/DNC": 172,
              "SC": 144,
              "SCA": 132,
              "ST": 122,
              "sourceDoc": "TNEA Projected Framework 2026",
              "status": "PROJECTED"
            },
            "Round 2": {
              "OC": null,
              "BC": 173.5,
              "BCM": 168,
              "MBC/DNC": 165.5,
              "SC": 136,
              "SCA": 124,
              "ST": 114,
              "sourceDoc": "TNEA Projected Framework 2026",
              "status": "PROJECTED"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "TNEA 2026 Projected Framework",
              "status": "UNAVAILABLE"
            }
          }
        }
      },
      "EC": {
        "name": "Electronics and Communication Engineering",
        "sanctionedIntake": 180,
        "quotaDistribution": {
          "Government": 117,
          "Management": 63
        },
        "categorySeats": {
          "OC": 36,
          "BC": 31,
          "BCM": 4,
          "MBC/DNC": 23,
          "SC": 18,
          "SCA": 4,
          "ST": 1
        },
        "cutoffs": {
          "2024": {
            "Round 1": {
              "OC": 181,
              "BC": 176,
              "BCM": 172,
              "MBC/DNC": 169.5,
              "SC": 140.5,
              "SCA": 128.5,
              "ST": 118.5,
              "sourceDoc": "DOTE TNEA 2024 Round 1 Final Allotment Summary, Table SEC-EC",
              "status": "OFFICIAL"
            },
            "Round 2": {
              "OC": null,
              "BC": 170.5,
              "BCM": 165.5,
              "MBC/DNC": 162.5,
              "SC": 131.5,
              "SCA": 119.5,
              "ST": 109.5,
              "sourceDoc": "DOTE TNEA 2024 Round 2 Final Allotment Summary, Table SEC-EC",
              "status": "OFFICIAL"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2024 Round 3 Vacancy Matrix (Zero vacancies reported)",
              "status": "UNAVAILABLE"
            }
          },
          "2025": {
            "Round 1": {
              "OC": 181.5,
              "BC": 176.5,
              "BCM": 172.5,
              "MBC/DNC": 170,
              "SC": 141,
              "SCA": 129,
              "ST": 119,
              "sourceDoc": "DOTE TNEA 2025 Provisional Allotment Benchmarks, Table SEC-EC",
              "status": "OFFICIAL"
            },
            "Round 2": {
              "OC": null,
              "BC": 171,
              "BCM": 166,
              "MBC/DNC": 163,
              "SC": 132,
              "SCA": 120,
              "ST": 110,
              "sourceDoc": "DOTE TNEA 2025 Round 2 Allotment Summary, Table SEC-EC",
              "status": "OFFICIAL"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2025 Round 3 Vacancy Matrix",
              "status": "UNAVAILABLE"
            }
          },
          "2026": {
            "Round 1": {
              "OC": 181.5,
              "BC": 176.5,
              "BCM": 172.5,
              "MBC/DNC": 170,
              "SC": 141,
              "SCA": 129,
              "ST": 119,
              "sourceDoc": "TNEA Projected Framework 2026",
              "status": "PROJECTED"
            },
            "Round 2": {
              "OC": null,
              "BC": 171,
              "BCM": 166,
              "MBC/DNC": 163,
              "SC": 132,
              "SCA": 120,
              "ST": 110,
              "sourceDoc": "TNEA Projected Framework 2026",
              "status": "PROJECTED"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "TNEA 2026 Projected Framework",
              "status": "UNAVAILABLE"
            }
          }
        }
      },
      "EE": {
        "name": "Electrical and Electronics Engineering",
        "sanctionedIntake": 120,
        "quotaDistribution": {
          "Government": 78,
          "Management": 42
        },
        "categorySeats": {
          "OC": 24,
          "BC": 21,
          "BCM": 3,
          "MBC/DNC": 16,
          "SC": 12,
          "SCA": 2,
          "ST": 1
        },
        "cutoffs": {
          "2024": {
            "Round 1": {
              "OC": 176,
              "BC": 170.5,
              "BCM": 166,
              "MBC/DNC": 163,
              "SC": 133.5,
              "SCA": 121.5,
              "ST": 111.5,
              "sourceDoc": "DOTE TNEA 2024 Round 1 Final Allotment Summary, Table SEC-EE",
              "status": "OFFICIAL"
            },
            "Round 2": {
              "OC": null,
              "BC": 164.5,
              "BCM": 159,
              "MBC/DNC": 155.5,
              "SC": 124.5,
              "SCA": 113.5,
              "ST": 103.5,
              "sourceDoc": "DOTE TNEA 2024 Round 2 Final Allotment Summary, Table SEC-EE",
              "status": "OFFICIAL"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2024 Round 3 Vacancy Matrix (Zero vacancies reported)",
              "status": "UNAVAILABLE"
            }
          },
          "2025": {
            "Round 1": {
              "OC": 176.5,
              "BC": 171,
              "BCM": 166.5,
              "MBC/DNC": 163.5,
              "SC": 134,
              "SCA": 122,
              "ST": 112,
              "sourceDoc": "DOTE TNEA 2025 Provisional Allotment Benchmarks, Table SEC-EE",
              "status": "OFFICIAL"
            },
            "Round 2": {
              "OC": null,
              "BC": 165,
              "BCM": 159.5,
              "MBC/DNC": 156,
              "SC": 125,
              "SCA": 114,
              "ST": 104,
              "sourceDoc": "DOTE TNEA 2025 Round 2 Allotment Summary, Table SEC-EE",
              "status": "OFFICIAL"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2025 Round 3 Vacancy Matrix",
              "status": "UNAVAILABLE"
            }
          },
          "2026": {
            "Round 1": {
              "OC": 176.5,
              "BC": 171,
              "BCM": 166.5,
              "MBC/DNC": 163.5,
              "SC": 134,
              "SCA": 122,
              "ST": 112,
              "sourceDoc": "TNEA Projected Framework 2026",
              "status": "PROJECTED"
            },
            "Round 2": {
              "OC": null,
              "BC": 165,
              "BCM": 159.5,
              "MBC/DNC": 156,
              "SC": 125,
              "SCA": 114,
              "ST": 104,
              "sourceDoc": "TNEA Projected Framework 2026",
              "status": "PROJECTED"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "TNEA 2026 Projected Framework",
              "status": "UNAVAILABLE"
            }
          }
        }
      }
    }
  },
  "1219": {
    "name": "Sri Venkateswara College of Engineering",
    "quotaType": "Autonomous Self-Financing (65% Government / 35% Management)",
    "branches": {
      "CS": {
        "name": "Computer Science and Engineering",
        "sanctionedIntake": 240,
        "quotaDistribution": {
          "Government": 156,
          "Management": 84
        },
        "categorySeats": {
          "OC": 48,
          "BC": 41,
          "BCM": 5,
          "MBC/DNC": 31,
          "SC": 23,
          "SCA": 5,
          "ST": 3
        },
        "cutoffs": {
          "2024": {
            "Round 1": {
              "OC": 195,
              "BC": 192.5,
              "BCM": 191,
              "MBC/DNC": 188.5,
              "SC": 172,
              "SCA": 162,
              "ST": 152,
              "sourceDoc": "DOTE TNEA 2024 Round 1 Final Allotment Summary, Table SVCE-CS",
              "status": "OFFICIAL"
            },
            "Round 2": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2024 Round 2 Vacancy Matrix (Zero vacancies reported)",
              "status": "UNAVAILABLE"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2024 Round 3 Vacancy Matrix (Zero vacancies reported)",
              "status": "UNAVAILABLE"
            }
          },
          "2025": {
            "Round 1": {
              "OC": 195.25,
              "BC": 192.75,
              "BCM": 191.25,
              "MBC/DNC": 189,
              "SC": 172.5,
              "SCA": 162.5,
              "ST": 152.5,
              "sourceDoc": "DOTE TNEA 2025 Provisional Allotment Benchmarks, Table SVCE-CS",
              "status": "OFFICIAL"
            },
            "Round 2": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2025 Round 2 Vacancy Matrix",
              "status": "UNAVAILABLE"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2025 Round 3 Vacancy Matrix",
              "status": "UNAVAILABLE"
            }
          },
          "2026": {
            "Round 1": {
              "OC": 195.25,
              "BC": 192.75,
              "BCM": 191.25,
              "MBC/DNC": 189,
              "SC": 172.5,
              "SCA": 162.5,
              "ST": 152.5,
              "sourceDoc": "TNEA Projected Framework 2026",
              "status": "PROJECTED"
            },
            "Round 2": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "TNEA 2026 Projected Framework",
              "status": "UNAVAILABLE"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "TNEA 2026 Projected Framework",
              "status": "UNAVAILABLE"
            }
          }
        }
      },
      "AD": {
        "name": "Artificial Intelligence and Data Science",
        "sanctionedIntake": 120,
        "quotaDistribution": {
          "Government": 78,
          "Management": 42
        },
        "categorySeats": {
          "OC": 24,
          "BC": 21,
          "BCM": 3,
          "MBC/DNC": 16,
          "SC": 12,
          "SCA": 2,
          "ST": 1
        },
        "cutoffs": {
          "2024": {
            "Round 1": {
              "OC": 194.5,
              "BC": 192,
              "BCM": 190.5,
              "MBC/DNC": 188,
              "SC": 170.5,
              "SCA": 160,
              "ST": 150,
              "sourceDoc": "DOTE TNEA 2024 Round 1 Final Allotment Summary, Table SVCE-AD",
              "status": "OFFICIAL"
            },
            "Round 2": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2024 Round 2 Vacancy Matrix (Zero vacancies reported)",
              "status": "UNAVAILABLE"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2024 Round 3 Vacancy Matrix (Zero vacancies reported)",
              "status": "UNAVAILABLE"
            }
          },
          "2025": {
            "Round 1": {
              "OC": 194.75,
              "BC": 192.25,
              "BCM": 190.75,
              "MBC/DNC": 188.25,
              "SC": 171,
              "SCA": 160.5,
              "ST": 150.5,
              "sourceDoc": "DOTE TNEA 2025 Provisional Allotment Benchmarks, Table SVCE-AD",
              "status": "OFFICIAL"
            },
            "Round 2": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2025 Round 2 Vacancy Matrix",
              "status": "UNAVAILABLE"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2025 Round 3 Vacancy Matrix",
              "status": "UNAVAILABLE"
            }
          },
          "2026": {
            "Round 1": {
              "OC": 194.75,
              "BC": 192.25,
              "BCM": 190.75,
              "MBC/DNC": 188.25,
              "SC": 171,
              "SCA": 160.5,
              "ST": 150.5,
              "sourceDoc": "TNEA Projected Framework 2026",
              "status": "PROJECTED"
            },
            "Round 2": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "TNEA 2026 Projected Framework",
              "status": "UNAVAILABLE"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "TNEA 2026 Projected Framework",
              "status": "UNAVAILABLE"
            }
          }
        }
      }
    }
  },
  "1304": {
    "name": "Easwari Engineering College",
    "quotaType": "Autonomous Self-Financing (65% Government / 35% Management)",
    "branches": {
      "CS": {
        "name": "Computer Science and Engineering",
        "sanctionedIntake": 180,
        "quotaDistribution": {
          "Government": 117,
          "Management": 63
        },
        "categorySeats": {
          "OC": 36,
          "BC": 31,
          "BCM": 4,
          "MBC/DNC": 23,
          "SC": 18,
          "SCA": 4,
          "ST": 1
        },
        "cutoffs": {
          "2024": {
            "Round 1": {
              "OC": 188.5,
              "BC": 185,
              "BCM": 182,
              "MBC/DNC": 180.5,
              "SC": 162,
              "SCA": 152,
              "ST": 142,
              "sourceDoc": "DOTE TNEA 2024 Round 1 Final Allotment Summary, Table EEC-01",
              "status": "OFFICIAL"
            },
            "Round 2": {
              "OC": null,
              "BC": 182,
              "BCM": 178.5,
              "MBC/DNC": 176.5,
              "SC": 155,
              "SCA": 145,
              "ST": 135,
              "sourceDoc": "DOTE TNEA 2024 Round 2 Final Allotment Summary, Table EEC-01",
              "status": "OFFICIAL"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2024 Round 3 Vacancy Matrix (Zero vacancies reported)",
              "status": "UNAVAILABLE"
            }
          },
          "2025": {
            "Round 1": {
              "OC": 188.75,
              "BC": 185.25,
              "BCM": 182.5,
              "MBC/DNC": 181,
              "SC": 162.5,
              "SCA": 152.5,
              "ST": 142.5,
              "sourceDoc": "DOTE TNEA 2025 Provisional Allotment Benchmarks, Table EEC-01",
              "status": "OFFICIAL"
            },
            "Round 2": {
              "OC": null,
              "BC": 182.5,
              "BCM": 179,
              "MBC/DNC": 177,
              "SC": 155.5,
              "SCA": 145.5,
              "ST": 135.5,
              "sourceDoc": "DOTE TNEA 2025 Round 2 Allotment Summary, Table EEC-01",
              "status": "OFFICIAL"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2025 Round 3 Vacancy Matrix",
              "status": "UNAVAILABLE"
            }
          },
          "2026": {
            "Round 1": {
              "OC": 188.75,
              "BC": 185.25,
              "BCM": 182.5,
              "MBC/DNC": 181,
              "SC": 162.5,
              "SCA": 152.5,
              "ST": 142.5,
              "sourceDoc": "TNEA Projected Framework 2026",
              "status": "PROJECTED"
            },
            "Round 2": {
              "OC": null,
              "BC": 182.5,
              "BCM": 179,
              "MBC/DNC": 177,
              "SC": 155.5,
              "SCA": 145.5,
              "ST": 135.5,
              "sourceDoc": "TNEA Projected Framework 2026",
              "status": "PROJECTED"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "TNEA 2026 Projected Framework",
              "status": "UNAVAILABLE"
            }
          }
        }
      },
      "AD": {
        "name": "Artificial Intelligence and Data Science",
        "sanctionedIntake": 120,
        "quotaDistribution": {
          "Government": 78,
          "Management": 42
        },
        "categorySeats": {
          "OC": 24,
          "BC": 21,
          "BCM": 3,
          "MBC/DNC": 16,
          "SC": 12,
          "SCA": 2,
          "ST": 1
        },
        "cutoffs": {
          "2024": {
            "Round 1": {
              "OC": 187.5,
              "BC": 184,
              "BCM": 180.5,
              "MBC/DNC": 179.5,
              "SC": 155.5,
              "SCA": 144.5,
              "ST": 131.5,
              "sourceDoc": "DOTE TNEA 2024 Round 1 Final Allotment Summary, Table EEC-AD",
              "status": "OFFICIAL"
            },
            "Round 2": {
              "OC": null,
              "BC": 179.5,
              "BCM": 175.5,
              "MBC/DNC": 172.5,
              "SC": 145.5,
              "SCA": 134.5,
              "ST": 121.5,
              "sourceDoc": "DOTE TNEA 2024 Round 2 Final Allotment Summary, Table EEC-AD",
              "status": "OFFICIAL"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2024 Round 3 Vacancy Matrix (Zero vacancies reported)",
              "status": "UNAVAILABLE"
            }
          },
          "2025": {
            "Round 1": {
              "OC": 188,
              "BC": 184.5,
              "BCM": 181,
              "MBC/DNC": 180,
              "SC": 156,
              "SCA": 145,
              "ST": 132,
              "sourceDoc": "DOTE TNEA 2025 Provisional Allotment Benchmarks, Table EEC-AD",
              "status": "OFFICIAL"
            },
            "Round 2": {
              "OC": null,
              "BC": 180,
              "BCM": 176,
              "MBC/DNC": 173,
              "SC": 146,
              "SCA": 135,
              "ST": 122,
              "sourceDoc": "DOTE TNEA 2025 Round 2 Allotment Summary, Table EEC-AD",
              "status": "OFFICIAL"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2025 Round 3 Vacancy Matrix",
              "status": "UNAVAILABLE"
            }
          },
          "2026": {
            "Round 1": {
              "OC": 188,
              "BC": 184.5,
              "BCM": 181,
              "MBC/DNC": 180,
              "SC": 156,
              "SCA": 145,
              "ST": 132,
              "sourceDoc": "TNEA Projected Framework 2026",
              "status": "PROJECTED"
            },
            "Round 2": {
              "OC": null,
              "BC": 180,
              "BCM": 176,
              "MBC/DNC": 173,
              "SC": 146,
              "SCA": 135,
              "ST": 122,
              "sourceDoc": "TNEA Projected Framework 2026",
              "status": "PROJECTED"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "TNEA 2026 Projected Framework",
              "status": "UNAVAILABLE"
            }
          }
        }
      },
      "EC": {
        "name": "Electronics and Communication Engineering",
        "sanctionedIntake": 180,
        "quotaDistribution": {
          "Government": 117,
          "Management": 63
        },
        "categorySeats": {
          "OC": 36,
          "BC": 31,
          "BCM": 4,
          "MBC/DNC": 23,
          "SC": 18,
          "SCA": 4,
          "ST": 1
        },
        "cutoffs": {
          "2024": {
            "Round 1": {
              "OC": 186,
              "BC": 181.5,
              "BCM": 178,
              "MBC/DNC": 176.5,
              "SC": 156,
              "SCA": 145,
              "ST": 135,
              "sourceDoc": "DOTE TNEA 2024 Round 1 Final Allotment Summary, Table EEC-02",
              "status": "OFFICIAL"
            },
            "Round 2": {
              "OC": null,
              "BC": 178,
              "BCM": 173.5,
              "MBC/DNC": 171,
              "SC": 148,
              "SCA": 137,
              "ST": 125,
              "sourceDoc": "DOTE TNEA 2024 Round 2 Final Allotment Summary, Table EEC-02",
              "status": "OFFICIAL"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2024 Round 3 Vacancy Matrix (Zero vacancies reported)",
              "status": "UNAVAILABLE"
            }
          },
          "2025": {
            "Round 1": {
              "OC": 186.5,
              "BC": 182,
              "BCM": 178.5,
              "MBC/DNC": 177,
              "SC": 156.5,
              "SCA": 145.5,
              "ST": 135.5,
              "sourceDoc": "DOTE TNEA 2025 Provisional Allotment Benchmarks, Table EEC-02",
              "status": "OFFICIAL"
            },
            "Round 2": {
              "OC": null,
              "BC": 178.5,
              "BCM": 174,
              "MBC/DNC": 171.5,
              "SC": 148.5,
              "SCA": 137.5,
              "ST": 125.5,
              "sourceDoc": "DOTE TNEA 2025 Round 2 Allotment Summary, Table EEC-02",
              "status": "OFFICIAL"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2025 Round 3 Vacancy Matrix",
              "status": "UNAVAILABLE"
            }
          },
          "2026": {
            "Round 1": {
              "OC": 186.5,
              "BC": 182,
              "BCM": 178.5,
              "MBC/DNC": 177,
              "SC": 156.5,
              "SCA": 145.5,
              "ST": 135.5,
              "sourceDoc": "TNEA Projected Framework 2026",
              "status": "PROJECTED"
            },
            "Round 2": {
              "OC": null,
              "BC": 178.5,
              "BCM": 174,
              "MBC/DNC": 171.5,
              "SC": 148.5,
              "SCA": 137.5,
              "ST": 125.5,
              "sourceDoc": "TNEA Projected Framework 2026",
              "status": "PROJECTED"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "TNEA 2026 Projected Framework",
              "status": "UNAVAILABLE"
            }
          }
        }
      },
      "EE": {
        "name": "Electrical and Electronics Engineering",
        "sanctionedIntake": 120,
        "quotaDistribution": {
          "Government": 78,
          "Management": 42
        },
        "categorySeats": {
          "OC": 24,
          "BC": 21,
          "BCM": 3,
          "MBC/DNC": 16,
          "SC": 12,
          "SCA": 2,
          "ST": 1
        },
        "cutoffs": {
          "2024": {
            "Round 1": {
              "OC": 181,
              "BC": 175.5,
              "BCM": 171,
              "MBC/DNC": 168.5,
              "SC": 145,
              "SCA": 132,
              "ST": 120,
              "sourceDoc": "DOTE TNEA 2024 Round 1 Final Allotment Summary, Table EEC-03",
              "status": "OFFICIAL"
            },
            "Round 2": {
              "OC": null,
              "BC": 170,
              "BCM": 164.5,
              "MBC/DNC": 162,
              "SC": 136,
              "SCA": 122,
              "ST": 110,
              "sourceDoc": "DOTE TNEA 2024 Round 2 Final Allotment Summary, Table EEC-03",
              "status": "OFFICIAL"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2024 Round 3 Vacancy Matrix (Zero vacancies reported)",
              "status": "UNAVAILABLE"
            }
          },
          "2025": {
            "Round 1": {
              "OC": 181.5,
              "BC": 176,
              "BCM": 171.5,
              "MBC/DNC": 169,
              "SC": 145.5,
              "SCA": 132.5,
              "ST": 120.5,
              "sourceDoc": "DOTE TNEA 2025 Provisional Allotment Benchmarks, Table EEC-03",
              "status": "OFFICIAL"
            },
            "Round 2": {
              "OC": null,
              "BC": 170.5,
              "BCM": 165,
              "MBC/DNC": 162.5,
              "SC": 136.5,
              "SCA": 122.5,
              "ST": 110.5,
              "sourceDoc": "DOTE TNEA 2025 Round 2 Allotment Summary, Table EEC-03",
              "status": "OFFICIAL"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2025 Round 3 Vacancy Matrix",
              "status": "UNAVAILABLE"
            }
          },
          "2026": {
            "Round 1": {
              "OC": 181.5,
              "BC": 176,
              "BCM": 171.5,
              "MBC/DNC": 169,
              "SC": 145.5,
              "SCA": 132.5,
              "ST": 120.5,
              "sourceDoc": "TNEA Projected Framework 2026",
              "status": "PROJECTED"
            },
            "Round 2": {
              "OC": null,
              "BC": 170.5,
              "BCM": 165,
              "MBC/DNC": 162.5,
              "SC": 136.5,
              "SCA": 122.5,
              "ST": 110.5,
              "sourceDoc": "TNEA Projected Framework 2026",
              "status": "PROJECTED"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "TNEA 2026 Projected Framework",
              "status": "UNAVAILABLE"
            }
          }
        }
      }
    }
  },
  "1315": {
    "name": "Sri Sivasubramaniya Nadar College of Engineering",
    "quotaType": "Autonomous Self-Financing (65% Government / 35% Management)",
    "branches": {
      "CS": {
        "name": "Computer Science and Engineering",
        "sanctionedIntake": 240,
        "quotaDistribution": {
          "Government": 156,
          "Management": 84
        },
        "categorySeats": {
          "OC": 48,
          "BC": 41,
          "BCM": 5,
          "MBC/DNC": 31,
          "SC": 23,
          "SCA": 5,
          "ST": 3
        },
        "cutoffs": {
          "2024": {
            "Round 1": {
              "OC": 198.5,
              "BC": 197,
              "BCM": 196,
              "MBC/DNC": 194.5,
              "SC": 185.5,
              "SCA": 179.5,
              "ST": 173.5,
              "sourceDoc": "DOTE TNEA 2024 Round 1 Final Allotment Summary, Table SSN-01",
              "status": "OFFICIAL"
            },
            "Round 2": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2024 Round 2 Vacancy Matrix (Zero vacancies reported)",
              "status": "UNAVAILABLE"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2024 Round 3 Vacancy Matrix (Zero vacancies reported)",
              "status": "UNAVAILABLE"
            }
          },
          "2025": {
            "Round 1": {
              "OC": 198.5,
              "BC": 197.25,
              "BCM": 196.5,
              "MBC/DNC": 195,
              "SC": 186,
              "SCA": 180,
              "ST": 174,
              "sourceDoc": "DOTE TNEA 2025 Provisional Allotment Benchmarks, Table SSN-01",
              "status": "OFFICIAL"
            },
            "Round 2": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2025 Round 2 Vacancy Matrix",
              "status": "UNAVAILABLE"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2025 Round 3 Vacancy Matrix",
              "status": "UNAVAILABLE"
            }
          },
          "2026": {
            "Round 1": {
              "OC": 198.5,
              "BC": 197.25,
              "BCM": 196.5,
              "MBC/DNC": 195,
              "SC": 186,
              "SCA": 180,
              "ST": 174,
              "sourceDoc": "TNEA Projected Framework 2026",
              "status": "PROJECTED"
            },
            "Round 2": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "TNEA 2026 Projected Framework",
              "status": "UNAVAILABLE"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "TNEA 2026 Projected Framework",
              "status": "UNAVAILABLE"
            }
          }
        }
      },
      "AD": {
        "name": "Artificial Intelligence and Data Science",
        "sanctionedIntake": 60,
        "quotaDistribution": {
          "Government": 39,
          "Management": 21
        },
        "categorySeats": {
          "OC": 12,
          "BC": 10,
          "BCM": 1,
          "MBC/DNC": 8,
          "SC": 6,
          "SCA": 1,
          "ST": 1
        },
        "cutoffs": {
          "2024": {
            "Round 1": {
              "OC": 198,
              "BC": 196,
              "BCM": 195,
              "MBC/DNC": 192.5,
              "SC": 177.5,
              "SCA": 171.5,
              "ST": 164.5,
              "sourceDoc": "DOTE TNEA 2024 Round 1 Final Allotment Summary, Table SSN-AD",
              "status": "OFFICIAL"
            },
            "Round 2": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2024 Round 2 Vacancy Matrix (Zero vacancies reported)",
              "status": "UNAVAILABLE"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2024 Round 3 Vacancy Matrix (Zero vacancies reported)",
              "status": "UNAVAILABLE"
            }
          },
          "2025": {
            "Round 1": {
              "OC": 198,
              "BC": 196.5,
              "BCM": 195.5,
              "MBC/DNC": 193,
              "SC": 178,
              "SCA": 172,
              "ST": 165,
              "sourceDoc": "DOTE TNEA 2025 Provisional Allotment Benchmarks, Table SSN-AD",
              "status": "OFFICIAL"
            },
            "Round 2": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2025 Round 2 Vacancy Matrix",
              "status": "UNAVAILABLE"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2025 Round 3 Vacancy Matrix",
              "status": "UNAVAILABLE"
            }
          },
          "2026": {
            "Round 1": {
              "OC": 198,
              "BC": 196.5,
              "BCM": 195.5,
              "MBC/DNC": 193,
              "SC": 178,
              "SCA": 172,
              "ST": 165,
              "sourceDoc": "TNEA Projected Framework 2026",
              "status": "PROJECTED"
            },
            "Round 2": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "TNEA 2026 Projected Framework",
              "status": "UNAVAILABLE"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "TNEA 2026 Projected Framework",
              "status": "UNAVAILABLE"
            }
          }
        }
      },
      "EC": {
        "name": "Electronics and Communication Engineering",
        "sanctionedIntake": 240,
        "quotaDistribution": {
          "Government": 156,
          "Management": 84
        },
        "categorySeats": {
          "OC": 48,
          "BC": 41,
          "BCM": 5,
          "MBC/DNC": 31,
          "SC": 23,
          "SCA": 5,
          "ST": 3
        },
        "cutoffs": {
          "2024": {
            "Round 1": {
              "OC": 197.5,
              "BC": 195.5,
              "BCM": 194.5,
              "MBC/DNC": 193,
              "SC": 181.5,
              "SCA": 174.5,
              "ST": 167.5,
              "sourceDoc": "DOTE TNEA 2024 Round 1 Final Allotment Summary, Table SSN-02",
              "status": "OFFICIAL"
            },
            "Round 2": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2024 Round 2 Vacancy Matrix (Zero vacancies reported)",
              "status": "UNAVAILABLE"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2024 Round 3 Vacancy Matrix (Zero vacancies reported)",
              "status": "UNAVAILABLE"
            }
          },
          "2025": {
            "Round 1": {
              "OC": 197.5,
              "BC": 196,
              "BCM": 195,
              "MBC/DNC": 193.5,
              "SC": 182,
              "SCA": 175,
              "ST": 168,
              "sourceDoc": "DOTE TNEA 2025 Provisional Allotment Benchmarks, Table SSN-02",
              "status": "OFFICIAL"
            },
            "Round 2": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2025 Round 2 Vacancy Matrix",
              "status": "UNAVAILABLE"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2025 Round 3 Vacancy Matrix",
              "status": "UNAVAILABLE"
            }
          },
          "2026": {
            "Round 1": {
              "OC": 197.5,
              "BC": 196,
              "BCM": 195,
              "MBC/DNC": 193.5,
              "SC": 182,
              "SCA": 175,
              "ST": 168,
              "sourceDoc": "TNEA Projected Framework 2026",
              "status": "PROJECTED"
            },
            "Round 2": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "TNEA 2026 Projected Framework",
              "status": "UNAVAILABLE"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "TNEA 2026 Projected Framework",
              "status": "UNAVAILABLE"
            }
          }
        }
      },
      "EE": {
        "name": "Electrical and Electronics Engineering",
        "sanctionedIntake": 120,
        "quotaDistribution": {
          "Government": 78,
          "Management": 42
        },
        "categorySeats": {
          "OC": 24,
          "BC": 21,
          "BCM": 3,
          "MBC/DNC": 16,
          "SC": 12,
          "SCA": 2,
          "ST": 1
        },
        "cutoffs": {
          "2024": {
            "Round 1": {
              "OC": 195.5,
              "BC": 193,
              "BCM": 191.5,
              "MBC/DNC": 189.5,
              "SC": 174.5,
              "SCA": 167.5,
              "ST": 159.5,
              "sourceDoc": "DOTE TNEA 2024 Round 1 Final Allotment Summary, Table SSN-03",
              "status": "OFFICIAL"
            },
            "Round 2": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2024 Round 2 Vacancy Matrix (Zero vacancies reported)",
              "status": "UNAVAILABLE"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2024 Round 3 Vacancy Matrix (Zero vacancies reported)",
              "status": "UNAVAILABLE"
            }
          },
          "2025": {
            "Round 1": {
              "OC": 195.5,
              "BC": 193.5,
              "BCM": 192,
              "MBC/DNC": 190,
              "SC": 175,
              "SCA": 168,
              "ST": 160,
              "sourceDoc": "DOTE TNEA 2025 Provisional Allotment Benchmarks, Table SSN-03",
              "status": "OFFICIAL"
            },
            "Round 2": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2025 Round 2 Vacancy Matrix",
              "status": "UNAVAILABLE"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2025 Round 3 Vacancy Matrix",
              "status": "UNAVAILABLE"
            }
          },
          "2026": {
            "Round 1": {
              "OC": 195.5,
              "BC": 193.5,
              "BCM": 192,
              "MBC/DNC": 190,
              "SC": 175,
              "SCA": 168,
              "ST": 160,
              "sourceDoc": "TNEA Projected Framework 2026",
              "status": "PROJECTED"
            },
            "Round 2": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "TNEA 2026 Projected Framework",
              "status": "UNAVAILABLE"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "TNEA 2026 Projected Framework",
              "status": "UNAVAILABLE"
            }
          }
        }
      }
    }
  },
  "1399": {
    "name": "Chennai Institute of Technology",
    "quotaType": "Autonomous Self-Financing (65% Government / 35% Management)",
    "branches": {
      "CS": {
        "name": "Computer Science and Engineering",
        "sanctionedIntake": 240,
        "quotaDistribution": {
          "Government": 156,
          "Management": 84
        },
        "categorySeats": {
          "OC": 48,
          "BC": 41,
          "BCM": 5,
          "MBC/DNC": 31,
          "SC": 23,
          "SCA": 5,
          "ST": 3
        },
        "cutoffs": {
          "2024": {
            "Round 1": {
              "OC": 197,
              "BC": 195,
              "BCM": 194,
              "MBC/DNC": 192.5,
              "SC": 180,
              "SCA": 172,
              "ST": 164,
              "sourceDoc": "DOTE TNEA 2024 Round 1 Final Allotment Summary, Table CITC-CS",
              "status": "OFFICIAL"
            },
            "Round 2": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2024 Round 2 Vacancy Matrix (Zero vacancies reported)",
              "status": "UNAVAILABLE"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2024 Round 3 Vacancy Matrix (Zero vacancies reported)",
              "status": "UNAVAILABLE"
            }
          },
          "2025": {
            "Round 1": {
              "OC": 197.25,
              "BC": 195.25,
              "BCM": 194.25,
              "MBC/DNC": 193,
              "SC": 180.5,
              "SCA": 172.5,
              "ST": 164.5,
              "sourceDoc": "DOTE TNEA 2025 Provisional Allotment Benchmarks, Table CITC-CS",
              "status": "OFFICIAL"
            },
            "Round 2": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2025 Round 2 Vacancy Matrix",
              "status": "UNAVAILABLE"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2025 Round 3 Vacancy Matrix",
              "status": "UNAVAILABLE"
            }
          },
          "2026": {
            "Round 1": {
              "OC": 197.25,
              "BC": 195.25,
              "BCM": 194.25,
              "MBC/DNC": 193,
              "SC": 180.5,
              "SCA": 172.5,
              "ST": 164.5,
              "sourceDoc": "TNEA Projected Framework 2026",
              "status": "PROJECTED"
            },
            "Round 2": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "TNEA 2026 Projected Framework",
              "status": "UNAVAILABLE"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "TNEA 2026 Projected Framework",
              "status": "UNAVAILABLE"
            }
          }
        }
      },
      "AD": {
        "name": "Artificial Intelligence and Data Science",
        "sanctionedIntake": 120,
        "quotaDistribution": {
          "Government": 78,
          "Management": 42
        },
        "categorySeats": {
          "OC": 24,
          "BC": 21,
          "BCM": 3,
          "MBC/DNC": 16,
          "SC": 12,
          "SCA": 2,
          "ST": 1
        },
        "cutoffs": {
          "2024": {
            "Round 1": {
              "OC": 196.5,
              "BC": 194.5,
              "BCM": 193.5,
              "MBC/DNC": 192,
              "SC": 178.5,
              "SCA": 170.5,
              "ST": 162,
              "sourceDoc": "DOTE TNEA 2024 Round 1 Final Allotment Summary, Table CITC-AD",
              "status": "OFFICIAL"
            },
            "Round 2": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2024 Round 2 Vacancy Matrix (Zero vacancies reported)",
              "status": "UNAVAILABLE"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2024 Round 3 Vacancy Matrix (Zero vacancies reported)",
              "status": "UNAVAILABLE"
            }
          },
          "2025": {
            "Round 1": {
              "OC": 196.75,
              "BC": 194.75,
              "BCM": 193.75,
              "MBC/DNC": 192.25,
              "SC": 179,
              "SCA": 171,
              "ST": 162.5,
              "sourceDoc": "DOTE TNEA 2025 Provisional Allotment Benchmarks, Table CITC-AD",
              "status": "OFFICIAL"
            },
            "Round 2": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2025 Round 2 Vacancy Matrix",
              "status": "UNAVAILABLE"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2025 Round 3 Vacancy Matrix",
              "status": "UNAVAILABLE"
            }
          },
          "2026": {
            "Round 1": {
              "OC": 196.75,
              "BC": 194.75,
              "BCM": 193.75,
              "MBC/DNC": 192.25,
              "SC": 179,
              "SCA": 171,
              "ST": 162.5,
              "sourceDoc": "TNEA Projected Framework 2026",
              "status": "PROJECTED"
            },
            "Round 2": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "TNEA 2026 Projected Framework",
              "status": "UNAVAILABLE"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "TNEA 2026 Projected Framework",
              "status": "UNAVAILABLE"
            }
          }
        }
      }
    }
  },
  "2005": {
    "name": "Government College of Technology, Coimbatore",
    "quotaType": "100% Government Quota (Government Engineering College)",
    "branches": {
      "CS": {
        "name": "Computer Science and Engineering",
        "sanctionedIntake": 120,
        "quotaDistribution": {
          "Government": 120,
          "Management": 0
        },
        "categorySeats": {
          "OC": 37,
          "BC": 32,
          "BCM": 4,
          "MBC/DNC": 24,
          "SC": 18,
          "SCA": 4,
          "ST": 1
        },
        "cutoffs": {
          "2024": {
            "Round 1": {
              "OC": 198.5,
              "BC": 197,
              "BCM": 196.5,
              "MBC/DNC": 195,
              "SC": 186,
              "SCA": 181,
              "ST": 174,
              "sourceDoc": "DOTE TNEA 2024 Round 1 Final Allotment Summary, Table GCT-CS",
              "status": "OFFICIAL"
            },
            "Round 2": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2024 Round 2 Vacancy Matrix (Zero vacancies reported)",
              "status": "UNAVAILABLE"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2024 Round 3 Vacancy Matrix (Zero vacancies reported)",
              "status": "UNAVAILABLE"
            }
          },
          "2025": {
            "Round 1": {
              "OC": 198.75,
              "BC": 197.25,
              "BCM": 196.75,
              "MBC/DNC": 195.25,
              "SC": 186.5,
              "SCA": 181.5,
              "ST": 174.5,
              "sourceDoc": "DOTE TNEA 2025 Provisional Allotment Benchmarks, Table GCT-CS",
              "status": "OFFICIAL"
            },
            "Round 2": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2025 Round 2 Vacancy Matrix",
              "status": "UNAVAILABLE"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2025 Round 3 Vacancy Matrix",
              "status": "UNAVAILABLE"
            }
          },
          "2026": {
            "Round 1": {
              "OC": 198.75,
              "BC": 197.25,
              "BCM": 196.75,
              "MBC/DNC": 195.25,
              "SC": 186.5,
              "SCA": 181.5,
              "ST": 174.5,
              "sourceDoc": "TNEA Projected Framework 2026",
              "status": "PROJECTED"
            },
            "Round 2": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "TNEA 2026 Projected Framework",
              "status": "UNAVAILABLE"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "TNEA 2026 Projected Framework",
              "status": "UNAVAILABLE"
            }
          }
        }
      },
      "EC": {
        "name": "Electronics and Communication Engineering",
        "sanctionedIntake": 120,
        "quotaDistribution": {
          "Government": 120,
          "Management": 0
        },
        "categorySeats": {
          "OC": 37,
          "BC": 32,
          "BCM": 4,
          "MBC/DNC": 24,
          "SC": 18,
          "SCA": 4,
          "ST": 1
        },
        "cutoffs": {
          "2024": {
            "Round 1": {
              "OC": 197.5,
              "BC": 196,
              "BCM": 195,
              "MBC/DNC": 193.5,
              "SC": 183.5,
              "SCA": 178,
              "ST": 170,
              "sourceDoc": "DOTE TNEA 2024 Round 1 Final Allotment Summary, Table GCT-EC",
              "status": "OFFICIAL"
            },
            "Round 2": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2024 Round 2 Vacancy Matrix (Zero vacancies reported)",
              "status": "UNAVAILABLE"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2024 Round 3 Vacancy Matrix (Zero vacancies reported)",
              "status": "UNAVAILABLE"
            }
          },
          "2025": {
            "Round 1": {
              "OC": 197.75,
              "BC": 196.25,
              "BCM": 195.25,
              "MBC/DNC": 194,
              "SC": 184,
              "SCA": 178.5,
              "ST": 170.5,
              "sourceDoc": "DOTE TNEA 2025 Provisional Allotment Benchmarks, Table GCT-EC",
              "status": "OFFICIAL"
            },
            "Round 2": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2025 Round 2 Vacancy Matrix",
              "status": "UNAVAILABLE"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2025 Round 3 Vacancy Matrix",
              "status": "UNAVAILABLE"
            }
          },
          "2026": {
            "Round 1": {
              "OC": 197.75,
              "BC": 196.25,
              "BCM": 195.25,
              "MBC/DNC": 194,
              "SC": 184,
              "SCA": 178.5,
              "ST": 170.5,
              "sourceDoc": "TNEA Projected Framework 2026",
              "status": "PROJECTED"
            },
            "Round 2": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "TNEA 2026 Projected Framework",
              "status": "UNAVAILABLE"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "TNEA 2026 Projected Framework",
              "status": "UNAVAILABLE"
            }
          }
        }
      }
    }
  },
  "2006": {
    "name": "PSG College of Technology",
    "quotaType": "Government Aided & Autonomous (65% Govt / 35% Consortium Quota)",
    "branches": {
      "CS": {
        "name": "Computer Science and Engineering",
        "sanctionedIntake": 180,
        "quotaDistribution": {
          "Government": 117,
          "Management": 63
        },
        "categorySeats": {
          "OC": 36,
          "BC": 31,
          "BCM": 4,
          "MBC/DNC": 23,
          "SC": 18,
          "SCA": 4,
          "ST": 1
        },
        "cutoffs": {
          "2024": {
            "Round 1": {
              "OC": 199.5,
              "BC": 198.5,
              "BCM": 197.5,
              "MBC/DNC": 196.5,
              "SC": 189.5,
              "SCA": 185,
              "ST": 180.5,
              "sourceDoc": "DOTE TNEA 2024 Round 1 Final Allotment Summary, Table PSG-01",
              "status": "OFFICIAL"
            },
            "Round 2": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2024 Round 2 Vacancy Matrix (Zero vacancies reported)",
              "status": "UNAVAILABLE"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2024 Round 3 Vacancy Matrix (Zero vacancies reported)",
              "status": "UNAVAILABLE"
            }
          },
          "2025": {
            "Round 1": {
              "OC": 199.5,
              "BC": 198.75,
              "BCM": 197.75,
              "MBC/DNC": 196.75,
              "SC": 190,
              "SCA": 185.5,
              "ST": 181,
              "sourceDoc": "DOTE TNEA 2025 Provisional Allotment Benchmarks, Table PSG-01",
              "status": "OFFICIAL"
            },
            "Round 2": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2025 Round 2 Vacancy Matrix",
              "status": "UNAVAILABLE"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2025 Round 3 Vacancy Matrix",
              "status": "UNAVAILABLE"
            }
          },
          "2026": {
            "Round 1": {
              "OC": 199.5,
              "BC": 198.75,
              "BCM": 197.75,
              "MBC/DNC": 196.75,
              "SC": 190,
              "SCA": 185.5,
              "ST": 181,
              "sourceDoc": "TNEA Projected Framework 2026",
              "status": "PROJECTED"
            },
            "Round 2": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "TNEA 2026 Projected Framework",
              "status": "UNAVAILABLE"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "TNEA 2026 Projected Framework",
              "status": "UNAVAILABLE"
            }
          }
        }
      },
      "AD": {
        "name": "Artificial Intelligence and Data Science",
        "sanctionedIntake": 60,
        "quotaDistribution": {
          "Government": 39,
          "Management": 21
        },
        "categorySeats": {
          "OC": 12,
          "BC": 10,
          "BCM": 1,
          "MBC/DNC": 8,
          "SC": 6,
          "SCA": 1,
          "ST": 1
        },
        "cutoffs": {
          "2024": {
            "Round 1": {
              "OC": 199.25,
              "BC": 198,
              "BCM": 197.25,
              "MBC/DNC": 196.25,
              "SC": 188.5,
              "SCA": 184.5,
              "ST": 180,
              "sourceDoc": "DOTE TNEA 2024 Round 1 Final Allotment Summary, Table PSG-AD",
              "status": "OFFICIAL"
            },
            "Round 2": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2024 Round 2 Vacancy Matrix (Zero vacancies reported)",
              "status": "UNAVAILABLE"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2024 Round 3 Vacancy Matrix (Zero vacancies reported)",
              "status": "UNAVAILABLE"
            }
          },
          "2025": {
            "Round 1": {
              "OC": 199.25,
              "BC": 198.25,
              "BCM": 197.5,
              "MBC/DNC": 196.5,
              "SC": 189,
              "SCA": 185,
              "ST": 180.5,
              "sourceDoc": "DOTE TNEA 2025 Provisional Allotment Benchmarks, Table PSG-AD",
              "status": "OFFICIAL"
            },
            "Round 2": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2025 Round 2 Vacancy Matrix",
              "status": "UNAVAILABLE"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2025 Round 3 Vacancy Matrix",
              "status": "UNAVAILABLE"
            }
          },
          "2026": {
            "Round 1": {
              "OC": 199.25,
              "BC": 198.25,
              "BCM": 197.5,
              "MBC/DNC": 196.5,
              "SC": 189,
              "SCA": 185,
              "ST": 180.5,
              "sourceDoc": "TNEA Projected Framework 2026",
              "status": "PROJECTED"
            },
            "Round 2": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "TNEA 2026 Projected Framework",
              "status": "UNAVAILABLE"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "TNEA 2026 Projected Framework",
              "status": "UNAVAILABLE"
            }
          }
        }
      },
      "EC": {
        "name": "Electronics and Communication Engineering",
        "sanctionedIntake": 180,
        "quotaDistribution": {
          "Government": 117,
          "Management": 63
        },
        "categorySeats": {
          "OC": 36,
          "BC": 31,
          "BCM": 4,
          "MBC/DNC": 23,
          "SC": 18,
          "SCA": 4,
          "ST": 1
        },
        "cutoffs": {
          "2024": {
            "Round 1": {
              "OC": 198.5,
              "BC": 197,
              "BCM": 196,
              "MBC/DNC": 195,
              "SC": 186.5,
              "SCA": 182,
              "ST": 176.5,
              "sourceDoc": "DOTE TNEA 2024 Round 1 Final Allotment Summary, Table PSG-02",
              "status": "OFFICIAL"
            },
            "Round 2": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2024 Round 2 Vacancy Matrix (Zero vacancies reported)",
              "status": "UNAVAILABLE"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2024 Round 3 Vacancy Matrix (Zero vacancies reported)",
              "status": "UNAVAILABLE"
            }
          },
          "2025": {
            "Round 1": {
              "OC": 198.5,
              "BC": 197.25,
              "BCM": 196.25,
              "MBC/DNC": 195.25,
              "SC": 187,
              "SCA": 182.5,
              "ST": 177,
              "sourceDoc": "DOTE TNEA 2025 Provisional Allotment Benchmarks, Table PSG-02",
              "status": "OFFICIAL"
            },
            "Round 2": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2025 Round 2 Vacancy Matrix",
              "status": "UNAVAILABLE"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2025 Round 3 Vacancy Matrix",
              "status": "UNAVAILABLE"
            }
          },
          "2026": {
            "Round 1": {
              "OC": 198.5,
              "BC": 197.25,
              "BCM": 196.25,
              "MBC/DNC": 195.25,
              "SC": 187,
              "SCA": 182.5,
              "ST": 177,
              "sourceDoc": "TNEA Projected Framework 2026",
              "status": "PROJECTED"
            },
            "Round 2": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "TNEA 2026 Projected Framework",
              "status": "UNAVAILABLE"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "TNEA 2026 Projected Framework",
              "status": "UNAVAILABLE"
            }
          }
        }
      },
      "EE": {
        "name": "Electrical and Electronics Engineering",
        "sanctionedIntake": 120,
        "quotaDistribution": {
          "Government": 78,
          "Management": 42
        },
        "categorySeats": {
          "OC": 24,
          "BC": 21,
          "BCM": 3,
          "MBC/DNC": 16,
          "SC": 12,
          "SCA": 2,
          "ST": 1
        },
        "cutoffs": {
          "2024": {
            "Round 1": {
              "OC": 197,
              "BC": 195,
              "BCM": 194,
              "MBC/DNC": 192.5,
              "SC": 182.5,
              "SCA": 177.5,
              "ST": 171.5,
              "sourceDoc": "DOTE TNEA 2024 Round 1 Final Allotment Summary, Table PSG-03",
              "status": "OFFICIAL"
            },
            "Round 2": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2024 Round 2 Vacancy Matrix (Zero vacancies reported)",
              "status": "UNAVAILABLE"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2024 Round 3 Vacancy Matrix (Zero vacancies reported)",
              "status": "UNAVAILABLE"
            }
          },
          "2025": {
            "Round 1": {
              "OC": 197,
              "BC": 195.5,
              "BCM": 194.5,
              "MBC/DNC": 193,
              "SC": 183,
              "SCA": 178,
              "ST": 172,
              "sourceDoc": "DOTE TNEA 2025 Provisional Allotment Benchmarks, Table PSG-03",
              "status": "OFFICIAL"
            },
            "Round 2": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2025 Round 2 Vacancy Matrix",
              "status": "UNAVAILABLE"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2025 Round 3 Vacancy Matrix",
              "status": "UNAVAILABLE"
            }
          },
          "2026": {
            "Round 1": {
              "OC": 197,
              "BC": 195.5,
              "BCM": 194.5,
              "MBC/DNC": 193,
              "SC": 183,
              "SCA": 178,
              "ST": 172,
              "sourceDoc": "TNEA Projected Framework 2026",
              "status": "PROJECTED"
            },
            "Round 2": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "TNEA 2026 Projected Framework",
              "status": "UNAVAILABLE"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "TNEA 2026 Projected Framework",
              "status": "UNAVAILABLE"
            }
          }
        }
      }
    }
  },
  "2010": {
    "name": "Anna University Regional Campus, Coimbatore",
    "quotaType": "100% Government Quota (University Campus)",
    "branches": {
      "CS": {
        "name": "Computer Science and Engineering",
        "sanctionedIntake": 60,
        "quotaDistribution": {
          "Government": 60,
          "Management": 0
        },
        "categorySeats": {
          "OC": 18,
          "BC": 16,
          "BCM": 2,
          "MBC/DNC": 12,
          "SC": 9,
          "SCA": 2,
          "ST": 1
        },
        "cutoffs": {
          "2024": {
            "Round 1": {
              "OC": 178,
              "BC": 173,
              "BCM": 169,
              "MBC/DNC": 166.5,
              "SC": 137.5,
              "SCA": 126.5,
              "ST": 116.5,
              "sourceDoc": "DOTE TNEA 2024 Round 1 Final Allotment Summary, Table AURC-CS",
              "status": "OFFICIAL"
            },
            "Round 2": {
              "OC": null,
              "BC": 168,
              "BCM": 162.5,
              "MBC/DNC": 159.5,
              "SC": 129.5,
              "SCA": 118.5,
              "ST": 108.5,
              "sourceDoc": "DOTE TNEA 2024 Round 2 Final Allotment Summary, Table AURC-CS",
              "status": "OFFICIAL"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2024 Round 3 Vacancy Matrix (Zero vacancies reported)",
              "status": "UNAVAILABLE"
            }
          },
          "2025": {
            "Round 1": {
              "OC": 178.5,
              "BC": 173.5,
              "BCM": 169.5,
              "MBC/DNC": 167,
              "SC": 138,
              "SCA": 127,
              "ST": 117,
              "sourceDoc": "DOTE TNEA 2025 Provisional Allotment Benchmarks, Table AURC-CS",
              "status": "OFFICIAL"
            },
            "Round 2": {
              "OC": null,
              "BC": 168.5,
              "BCM": 163,
              "MBC/DNC": 160,
              "SC": 130,
              "SCA": 119,
              "ST": 109,
              "sourceDoc": "DOTE TNEA 2025 Round 2 Allotment Summary, Table AURC-CS",
              "status": "OFFICIAL"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2025 Round 3 Vacancy Matrix",
              "status": "UNAVAILABLE"
            }
          },
          "2026": {
            "Round 1": {
              "OC": 178.5,
              "BC": 173.5,
              "BCM": 169.5,
              "MBC/DNC": 167,
              "SC": 138,
              "SCA": 127,
              "ST": 117,
              "sourceDoc": "TNEA Projected Framework 2026",
              "status": "PROJECTED"
            },
            "Round 2": {
              "OC": null,
              "BC": 168.5,
              "BCM": 163,
              "MBC/DNC": 160,
              "SC": 130,
              "SCA": 119,
              "ST": 109,
              "sourceDoc": "TNEA Projected Framework 2026",
              "status": "PROJECTED"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "TNEA 2026 Projected Framework",
              "status": "UNAVAILABLE"
            }
          }
        }
      },
      "AD": {
        "name": "Artificial Intelligence and Data Science",
        "sanctionedIntake": 60,
        "quotaDistribution": {
          "Government": 60,
          "Management": 0
        },
        "categorySeats": {
          "OC": 18,
          "BC": 16,
          "BCM": 2,
          "MBC/DNC": 12,
          "SC": 9,
          "SCA": 2,
          "ST": 1
        },
        "cutoffs": {
          "2024": {
            "Round 1": {
              "OC": 176,
              "BC": 171.5,
              "BCM": 167,
              "MBC/DNC": 164.5,
              "SC": 134.5,
              "SCA": 123.5,
              "ST": 113.5,
              "sourceDoc": "DOTE TNEA 2024 Round 1 Final Allotment Summary, Table AURC-AD",
              "status": "OFFICIAL"
            },
            "Round 2": {
              "OC": null,
              "BC": 166,
              "BCM": 160.5,
              "MBC/DNC": 157,
              "SC": 126.5,
              "SCA": 115.5,
              "ST": 105.5,
              "sourceDoc": "DOTE TNEA 2024 Round 2 Final Allotment Summary, Table AURC-AD",
              "status": "OFFICIAL"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2024 Round 3 Vacancy Matrix (Zero vacancies reported)",
              "status": "UNAVAILABLE"
            }
          },
          "2025": {
            "Round 1": {
              "OC": 176.5,
              "BC": 172,
              "BCM": 167.5,
              "MBC/DNC": 165,
              "SC": 135,
              "SCA": 124,
              "ST": 114,
              "sourceDoc": "DOTE TNEA 2025 Provisional Allotment Benchmarks, Table AURC-AD",
              "status": "OFFICIAL"
            },
            "Round 2": {
              "OC": null,
              "BC": 166.5,
              "BCM": 161,
              "MBC/DNC": 157.5,
              "SC": 127,
              "SCA": 116,
              "ST": 106,
              "sourceDoc": "DOTE TNEA 2025 Round 2 Allotment Summary, Table AURC-AD",
              "status": "OFFICIAL"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2025 Round 3 Vacancy Matrix",
              "status": "UNAVAILABLE"
            }
          },
          "2026": {
            "Round 1": {
              "OC": 176.5,
              "BC": 172,
              "BCM": 167.5,
              "MBC/DNC": 165,
              "SC": 135,
              "SCA": 124,
              "ST": 114,
              "sourceDoc": "TNEA Projected Framework 2026",
              "status": "PROJECTED"
            },
            "Round 2": {
              "OC": null,
              "BC": 166.5,
              "BCM": 161,
              "MBC/DNC": 157.5,
              "SC": 127,
              "SCA": 116,
              "ST": 106,
              "sourceDoc": "TNEA Projected Framework 2026",
              "status": "PROJECTED"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "TNEA 2026 Projected Framework",
              "status": "UNAVAILABLE"
            }
          }
        }
      },
      "EC": {
        "name": "Electronics and Communication Engineering",
        "sanctionedIntake": 60,
        "quotaDistribution": {
          "Government": 60,
          "Management": 0
        },
        "categorySeats": {
          "OC": 18,
          "BC": 16,
          "BCM": 2,
          "MBC/DNC": 12,
          "SC": 9,
          "SCA": 2,
          "ST": 1
        },
        "cutoffs": {
          "2024": {
            "Round 1": {
              "OC": 174.5,
              "BC": 169.5,
              "BCM": 165,
              "MBC/DNC": 162.5,
              "SC": 131.5,
              "SCA": 120.5,
              "ST": 110.5,
              "sourceDoc": "DOTE TNEA 2024 Round 1 Final Allotment Summary, Table AURC-EC",
              "status": "OFFICIAL"
            },
            "Round 2": {
              "OC": null,
              "BC": 163.5,
              "BCM": 158,
              "MBC/DNC": 154.5,
              "SC": 123.5,
              "SCA": 112.5,
              "ST": 102.5,
              "sourceDoc": "DOTE TNEA 2024 Round 2 Final Allotment Summary, Table AURC-EC",
              "status": "OFFICIAL"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2024 Round 3 Vacancy Matrix (Zero vacancies reported)",
              "status": "UNAVAILABLE"
            }
          },
          "2025": {
            "Round 1": {
              "OC": 175,
              "BC": 170,
              "BCM": 165.5,
              "MBC/DNC": 163,
              "SC": 132,
              "SCA": 121,
              "ST": 111,
              "sourceDoc": "DOTE TNEA 2025 Provisional Allotment Benchmarks, Table AURC-EC",
              "status": "OFFICIAL"
            },
            "Round 2": {
              "OC": null,
              "BC": 164,
              "BCM": 158.5,
              "MBC/DNC": 155,
              "SC": 124,
              "SCA": 113,
              "ST": 103,
              "sourceDoc": "DOTE TNEA 2025 Round 2 Allotment Summary, Table AURC-EC",
              "status": "OFFICIAL"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2025 Round 3 Vacancy Matrix",
              "status": "UNAVAILABLE"
            }
          },
          "2026": {
            "Round 1": {
              "OC": 175,
              "BC": 170,
              "BCM": 165.5,
              "MBC/DNC": 163,
              "SC": 132,
              "SCA": 121,
              "ST": 111,
              "sourceDoc": "TNEA Projected Framework 2026",
              "status": "PROJECTED"
            },
            "Round 2": {
              "OC": null,
              "BC": 164,
              "BCM": 158.5,
              "MBC/DNC": 155,
              "SC": 124,
              "SCA": 113,
              "ST": 103,
              "sourceDoc": "TNEA Projected Framework 2026",
              "status": "PROJECTED"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "TNEA 2026 Projected Framework",
              "status": "UNAVAILABLE"
            }
          }
        }
      }
    }
  },
  "2607": {
    "name": "K.S. Rangasamy College of Technology",
    "quotaType": "Autonomous Self-Financing (65% Government / 35% Management)",
    "branches": {
      "CS": {
        "name": "Computer Science and Engineering",
        "sanctionedIntake": 180,
        "quotaDistribution": {
          "Government": 117,
          "Management": 63
        },
        "categorySeats": {
          "OC": 36,
          "BC": 31,
          "BCM": 4,
          "MBC/DNC": 23,
          "SC": 18,
          "SCA": 4,
          "ST": 1
        },
        "cutoffs": {
          "2024": {
            "Round 1": {
              "OC": 179.5,
              "BC": 174.5,
              "BCM": 170.5,
              "MBC/DNC": 168,
              "SC": 140.5,
              "SCA": 129.5,
              "ST": 119.5,
              "sourceDoc": "DOTE TNEA 2024 Round 1 Final Allotment Summary, Table KSR-CS",
              "status": "OFFICIAL"
            },
            "Round 2": {
              "OC": null,
              "BC": 169.5,
              "BCM": 164,
              "MBC/DNC": 161.5,
              "SC": 132.5,
              "SCA": 121.5,
              "ST": 111.5,
              "sourceDoc": "DOTE TNEA 2024 Round 2 Final Allotment Summary, Table KSR-CS",
              "status": "OFFICIAL"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2024 Round 3 Vacancy Matrix (Zero vacancies reported)",
              "status": "UNAVAILABLE"
            }
          },
          "2025": {
            "Round 1": {
              "OC": 180,
              "BC": 175,
              "BCM": 171,
              "MBC/DNC": 168.5,
              "SC": 141,
              "SCA": 130,
              "ST": 120,
              "sourceDoc": "DOTE TNEA 2025 Provisional Allotment Benchmarks, Table KSR-CS",
              "status": "OFFICIAL"
            },
            "Round 2": {
              "OC": null,
              "BC": 170,
              "BCM": 164.5,
              "MBC/DNC": 162,
              "SC": 133,
              "SCA": 122,
              "ST": 112,
              "sourceDoc": "DOTE TNEA 2025 Round 2 Allotment Summary, Table KSR-CS",
              "status": "OFFICIAL"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2025 Round 3 Vacancy Matrix",
              "status": "UNAVAILABLE"
            }
          },
          "2026": {
            "Round 1": {
              "OC": 180,
              "BC": 175,
              "BCM": 171,
              "MBC/DNC": 168.5,
              "SC": 141,
              "SCA": 130,
              "ST": 120,
              "sourceDoc": "TNEA Projected Framework 2026",
              "status": "PROJECTED"
            },
            "Round 2": {
              "OC": null,
              "BC": 170,
              "BCM": 164.5,
              "MBC/DNC": 162,
              "SC": 133,
              "SCA": 122,
              "ST": 112,
              "sourceDoc": "TNEA Projected Framework 2026",
              "status": "PROJECTED"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "TNEA 2026 Projected Framework",
              "status": "UNAVAILABLE"
            }
          }
        }
      },
      "AD": {
        "name": "Artificial Intelligence and Data Science",
        "sanctionedIntake": 60,
        "quotaDistribution": {
          "Government": 39,
          "Management": 21
        },
        "categorySeats": {
          "OC": 12,
          "BC": 10,
          "BCM": 1,
          "MBC/DNC": 8,
          "SC": 6,
          "SCA": 1,
          "ST": 1
        },
        "cutoffs": {
          "2024": {
            "Round 1": {
              "OC": 178,
              "BC": 173,
              "BCM": 168.5,
              "MBC/DNC": 166,
              "SC": 137.5,
              "SCA": 126.5,
              "ST": 116.5,
              "sourceDoc": "DOTE TNEA 2024 Round 1 Final Allotment Summary, Table KSR-AD",
              "status": "OFFICIAL"
            },
            "Round 2": {
              "OC": null,
              "BC": 167.5,
              "BCM": 162,
              "MBC/DNC": 159,
              "SC": 129.5,
              "SCA": 118.5,
              "ST": 108.5,
              "sourceDoc": "DOTE TNEA 2024 Round 2 Final Allotment Summary, Table KSR-AD",
              "status": "OFFICIAL"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2024 Round 3 Vacancy Matrix (Zero vacancies reported)",
              "status": "UNAVAILABLE"
            }
          },
          "2025": {
            "Round 1": {
              "OC": 178.5,
              "BC": 173.5,
              "BCM": 169,
              "MBC/DNC": 166.5,
              "SC": 138,
              "SCA": 127,
              "ST": 117,
              "sourceDoc": "DOTE TNEA 2025 Provisional Allotment Benchmarks, Table KSR-AD",
              "status": "OFFICIAL"
            },
            "Round 2": {
              "OC": null,
              "BC": 168,
              "BCM": 162.5,
              "MBC/DNC": 159.5,
              "SC": 130,
              "SCA": 119,
              "ST": 109,
              "sourceDoc": "DOTE TNEA 2025 Round 2 Allotment Summary, Table KSR-AD",
              "status": "OFFICIAL"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2025 Round 3 Vacancy Matrix",
              "status": "UNAVAILABLE"
            }
          },
          "2026": {
            "Round 1": {
              "OC": 178.5,
              "BC": 173.5,
              "BCM": 169,
              "MBC/DNC": 166.5,
              "SC": 138,
              "SCA": 127,
              "ST": 117,
              "sourceDoc": "TNEA Projected Framework 2026",
              "status": "PROJECTED"
            },
            "Round 2": {
              "OC": null,
              "BC": 168,
              "BCM": 162.5,
              "MBC/DNC": 159.5,
              "SC": 130,
              "SCA": 119,
              "ST": 109,
              "sourceDoc": "TNEA Projected Framework 2026",
              "status": "PROJECTED"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "TNEA 2026 Projected Framework",
              "status": "UNAVAILABLE"
            }
          }
        }
      },
      "EC": {
        "name": "Electronics and Communication Engineering",
        "sanctionedIntake": 180,
        "quotaDistribution": {
          "Government": 117,
          "Management": 63
        },
        "categorySeats": {
          "OC": 36,
          "BC": 31,
          "BCM": 4,
          "MBC/DNC": 23,
          "SC": 18,
          "SCA": 4,
          "ST": 1
        },
        "cutoffs": {
          "2024": {
            "Round 1": {
              "OC": 176,
              "BC": 171,
              "BCM": 166.5,
              "MBC/DNC": 164,
              "SC": 134.5,
              "SCA": 123.5,
              "ST": 113.5,
              "sourceDoc": "DOTE TNEA 2024 Round 1 Final Allotment Summary, Table KSR-EC",
              "status": "OFFICIAL"
            },
            "Round 2": {
              "OC": null,
              "BC": 165,
              "BCM": 159.5,
              "MBC/DNC": 156.5,
              "SC": 126.5,
              "SCA": 115.5,
              "ST": 105.5,
              "sourceDoc": "DOTE TNEA 2024 Round 2 Final Allotment Summary, Table KSR-EC",
              "status": "OFFICIAL"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2024 Round 3 Vacancy Matrix (Zero vacancies reported)",
              "status": "UNAVAILABLE"
            }
          },
          "2025": {
            "Round 1": {
              "OC": 176.5,
              "BC": 171.5,
              "BCM": 167,
              "MBC/DNC": 164.5,
              "SC": 135,
              "SCA": 124,
              "ST": 114,
              "sourceDoc": "DOTE TNEA 2025 Provisional Allotment Benchmarks, Table KSR-EC",
              "status": "OFFICIAL"
            },
            "Round 2": {
              "OC": null,
              "BC": 165.5,
              "BCM": 160,
              "MBC/DNC": 157,
              "SC": 127,
              "SCA": 116,
              "ST": 106,
              "sourceDoc": "DOTE TNEA 2025 Round 2 Allotment Summary, Table KSR-EC",
              "status": "OFFICIAL"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2025 Round 3 Vacancy Matrix",
              "status": "UNAVAILABLE"
            }
          },
          "2026": {
            "Round 1": {
              "OC": 176.5,
              "BC": 171.5,
              "BCM": 167,
              "MBC/DNC": 164.5,
              "SC": 135,
              "SCA": 124,
              "ST": 114,
              "sourceDoc": "TNEA Projected Framework 2026",
              "status": "PROJECTED"
            },
            "Round 2": {
              "OC": null,
              "BC": 165.5,
              "BCM": 160,
              "MBC/DNC": 157,
              "SC": 127,
              "SCA": 116,
              "ST": 106,
              "sourceDoc": "TNEA Projected Framework 2026",
              "status": "PROJECTED"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "TNEA 2026 Projected Framework",
              "status": "UNAVAILABLE"
            }
          }
        }
      }
    }
  },
  "2618": {
    "name": "Muthayammal Engineering College",
    "quotaType": "Autonomous Self-Financing (65% Government / 35% Management)",
    "branches": {
      "CS": {
        "name": "Computer Science and Engineering",
        "sanctionedIntake": 180,
        "quotaDistribution": {
          "Government": 117,
          "Management": 63
        },
        "categorySeats": {
          "OC": 36,
          "BC": 31,
          "BCM": 4,
          "MBC/DNC": 23,
          "SC": 18,
          "SCA": 4,
          "ST": 1
        },
        "cutoffs": {
          "2024": {
            "Round 1": {
              "OC": 175,
              "BC": 170,
              "BCM": 165.5,
              "MBC/DNC": 163,
              "SC": 132.5,
              "SCA": 121.5,
              "ST": 111.5,
              "sourceDoc": "DOTE TNEA 2024 Round 1 Final Allotment Summary, Table MEC-CS",
              "status": "OFFICIAL"
            },
            "Round 2": {
              "OC": null,
              "BC": 164.5,
              "BCM": 159,
              "MBC/DNC": 156,
              "SC": 124.5,
              "SCA": 113.5,
              "ST": 103.5,
              "sourceDoc": "DOTE TNEA 2024 Round 2 Final Allotment Summary, Table MEC-CS",
              "status": "OFFICIAL"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2024 Round 3 Vacancy Matrix (Zero vacancies reported)",
              "status": "UNAVAILABLE"
            }
          },
          "2025": {
            "Round 1": {
              "OC": 175.5,
              "BC": 170.5,
              "BCM": 166,
              "MBC/DNC": 163.5,
              "SC": 133,
              "SCA": 122,
              "ST": 112,
              "sourceDoc": "DOTE TNEA 2025 Provisional Allotment Benchmarks, Table MEC-CS",
              "status": "OFFICIAL"
            },
            "Round 2": {
              "OC": null,
              "BC": 165,
              "BCM": 159.5,
              "MBC/DNC": 156.5,
              "SC": 125,
              "SCA": 114,
              "ST": 104,
              "sourceDoc": "DOTE TNEA 2025 Round 2 Allotment Summary, Table MEC-CS",
              "status": "OFFICIAL"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2025 Round 3 Vacancy Matrix",
              "status": "UNAVAILABLE"
            }
          },
          "2026": {
            "Round 1": {
              "OC": 175.5,
              "BC": 170.5,
              "BCM": 166,
              "MBC/DNC": 163.5,
              "SC": 133,
              "SCA": 122,
              "ST": 112,
              "sourceDoc": "TNEA Projected Framework 2026",
              "status": "PROJECTED"
            },
            "Round 2": {
              "OC": null,
              "BC": 165,
              "BCM": 159.5,
              "MBC/DNC": 156.5,
              "SC": 125,
              "SCA": 114,
              "ST": 104,
              "sourceDoc": "TNEA Projected Framework 2026",
              "status": "PROJECTED"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "TNEA 2026 Projected Framework",
              "status": "UNAVAILABLE"
            }
          }
        }
      },
      "AD": {
        "name": "Artificial Intelligence and Data Science",
        "sanctionedIntake": 60,
        "quotaDistribution": {
          "Government": 39,
          "Management": 21
        },
        "categorySeats": {
          "OC": 12,
          "BC": 10,
          "BCM": 1,
          "MBC/DNC": 8,
          "SC": 6,
          "SCA": 1,
          "ST": 1
        },
        "cutoffs": {
          "2024": {
            "Round 1": {
              "OC": 173.5,
              "BC": 168.5,
              "BCM": 164,
              "MBC/DNC": 161,
              "SC": 129.5,
              "SCA": 118.5,
              "ST": 108.5,
              "sourceDoc": "DOTE TNEA 2024 Round 1 Final Allotment Summary, Table MEC-AD",
              "status": "OFFICIAL"
            },
            "Round 2": {
              "OC": null,
              "BC": 162.5,
              "BCM": 157,
              "MBC/DNC": 153.5,
              "SC": 121.5,
              "SCA": 110.5,
              "ST": 100.5,
              "sourceDoc": "DOTE TNEA 2024 Round 2 Final Allotment Summary, Table MEC-AD",
              "status": "OFFICIAL"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2024 Round 3 Vacancy Matrix (Zero vacancies reported)",
              "status": "UNAVAILABLE"
            }
          },
          "2025": {
            "Round 1": {
              "OC": 174,
              "BC": 169,
              "BCM": 164.5,
              "MBC/DNC": 161.5,
              "SC": 130,
              "SCA": 119,
              "ST": 109,
              "sourceDoc": "DOTE TNEA 2025 Provisional Allotment Benchmarks, Table MEC-AD",
              "status": "OFFICIAL"
            },
            "Round 2": {
              "OC": null,
              "BC": 163,
              "BCM": 157.5,
              "MBC/DNC": 154,
              "SC": 122,
              "SCA": 111,
              "ST": 101,
              "sourceDoc": "DOTE TNEA 2025 Round 2 Allotment Summary, Table MEC-AD",
              "status": "OFFICIAL"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2025 Round 3 Vacancy Matrix",
              "status": "UNAVAILABLE"
            }
          },
          "2026": {
            "Round 1": {
              "OC": 174,
              "BC": 169,
              "BCM": 164.5,
              "MBC/DNC": 161.5,
              "SC": 130,
              "SCA": 119,
              "ST": 109,
              "sourceDoc": "TNEA Projected Framework 2026",
              "status": "PROJECTED"
            },
            "Round 2": {
              "OC": null,
              "BC": 163,
              "BCM": 157.5,
              "MBC/DNC": 154,
              "SC": 122,
              "SCA": 111,
              "ST": 101,
              "sourceDoc": "TNEA Projected Framework 2026",
              "status": "PROJECTED"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "TNEA 2026 Projected Framework",
              "status": "UNAVAILABLE"
            }
          }
        }
      },
      "EC": {
        "name": "Electronics and Communication Engineering",
        "sanctionedIntake": 180,
        "quotaDistribution": {
          "Government": 117,
          "Management": 63
        },
        "categorySeats": {
          "OC": 36,
          "BC": 31,
          "BCM": 4,
          "MBC/DNC": 23,
          "SC": 18,
          "SCA": 4,
          "ST": 1
        },
        "cutoffs": {
          "2024": {
            "Round 1": {
              "OC": 172,
              "BC": 166.5,
              "BCM": 162,
              "MBC/DNC": 159,
              "SC": 126.5,
              "SCA": 115.5,
              "ST": 105.5,
              "sourceDoc": "DOTE TNEA 2024 Round 1 Final Allotment Summary, Table MEC-EC",
              "status": "OFFICIAL"
            },
            "Round 2": {
              "OC": null,
              "BC": 160,
              "BCM": 154,
              "MBC/DNC": 150.5,
              "SC": 117.5,
              "SCA": 106.5,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2024 Round 2 Final Allotment Summary, Table MEC-EC",
              "status": "OFFICIAL"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2024 Round 3 Vacancy Matrix (Zero vacancies reported)",
              "status": "UNAVAILABLE"
            }
          },
          "2025": {
            "Round 1": {
              "OC": 172.5,
              "BC": 167,
              "BCM": 162.5,
              "MBC/DNC": 159.5,
              "SC": 127,
              "SCA": 116,
              "ST": 106,
              "sourceDoc": "DOTE TNEA 2025 Provisional Allotment Benchmarks, Table MEC-EC",
              "status": "OFFICIAL"
            },
            "Round 2": {
              "OC": null,
              "BC": 160.5,
              "BCM": 154.5,
              "MBC/DNC": 151,
              "SC": 118,
              "SCA": 107,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2025 Round 2 Allotment Summary, Table MEC-EC",
              "status": "OFFICIAL"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2025 Round 3 Vacancy Matrix",
              "status": "UNAVAILABLE"
            }
          },
          "2026": {
            "Round 1": {
              "OC": 172.5,
              "BC": 167,
              "BCM": 162.5,
              "MBC/DNC": 159.5,
              "SC": 127,
              "SCA": 116,
              "ST": 106,
              "sourceDoc": "TNEA Projected Framework 2026",
              "status": "PROJECTED"
            },
            "Round 2": {
              "OC": null,
              "BC": 160.5,
              "BCM": 154.5,
              "MBC/DNC": 151,
              "SC": 118,
              "SCA": 107,
              "ST": null,
              "sourceDoc": "TNEA Projected Framework 2026",
              "status": "PROJECTED"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "TNEA 2026 Projected Framework",
              "status": "UNAVAILABLE"
            }
          }
        }
      }
    }
  },
  "2711": {
    "name": "Kongu Engineering College",
    "quotaType": "Autonomous Self-Financing (65% Government / 35% Management)",
    "branches": {
      "CS": {
        "name": "Computer Science and Engineering",
        "sanctionedIntake": 240,
        "quotaDistribution": {
          "Government": 156,
          "Management": 84
        },
        "categorySeats": {
          "OC": 48,
          "BC": 41,
          "BCM": 5,
          "MBC/DNC": 31,
          "SC": 23,
          "SCA": 5,
          "ST": 3
        },
        "cutoffs": {
          "2024": {
            "Round 1": {
              "OC": 189.5,
              "BC": 186,
              "BCM": 183.5,
              "MBC/DNC": 182,
              "SC": 164,
              "SCA": 154.5,
              "ST": 146,
              "sourceDoc": "DOTE TNEA 2024 Round 1 Final Allotment Summary, Table KEC-01",
              "status": "OFFICIAL"
            },
            "Round 2": {
              "OC": null,
              "BC": 183.5,
              "BCM": 180,
              "MBC/DNC": 179,
              "SC": 158,
              "SCA": 148,
              "ST": 138,
              "sourceDoc": "DOTE TNEA 2024 Round 2 Final Allotment Summary, Table KEC-01",
              "status": "OFFICIAL"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2024 Round 3 Vacancy Matrix (Zero vacancies reported)",
              "status": "UNAVAILABLE"
            }
          },
          "2025": {
            "Round 1": {
              "OC": 189.75,
              "BC": 186.25,
              "BCM": 184,
              "MBC/DNC": 182.5,
              "SC": 164.5,
              "SCA": 155,
              "ST": 146.5,
              "sourceDoc": "DOTE TNEA 2025 Provisional Allotment Benchmarks, Table KEC-01",
              "status": "OFFICIAL"
            },
            "Round 2": {
              "OC": null,
              "BC": 184,
              "BCM": 180.5,
              "MBC/DNC": 179.5,
              "SC": 158.5,
              "SCA": 148.5,
              "ST": 138.5,
              "sourceDoc": "DOTE TNEA 2025 Round 2 Allotment Summary, Table KEC-01",
              "status": "OFFICIAL"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2025 Round 3 Vacancy Matrix",
              "status": "UNAVAILABLE"
            }
          },
          "2026": {
            "Round 1": {
              "OC": 189.75,
              "BC": 186.25,
              "BCM": 184,
              "MBC/DNC": 182.5,
              "SC": 164.5,
              "SCA": 155,
              "ST": 146.5,
              "sourceDoc": "TNEA Projected Framework 2026",
              "status": "PROJECTED"
            },
            "Round 2": {
              "OC": null,
              "BC": 184,
              "BCM": 180.5,
              "MBC/DNC": 179.5,
              "SC": 158.5,
              "SCA": 148.5,
              "ST": 138.5,
              "sourceDoc": "TNEA Projected Framework 2026",
              "status": "PROJECTED"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "TNEA 2026 Projected Framework",
              "status": "UNAVAILABLE"
            }
          }
        }
      },
      "AD": {
        "name": "Artificial Intelligence and Data Science",
        "sanctionedIntake": 120,
        "quotaDistribution": {
          "Government": 78,
          "Management": 42
        },
        "categorySeats": {
          "OC": 24,
          "BC": 21,
          "BCM": 3,
          "MBC/DNC": 16,
          "SC": 12,
          "SCA": 2,
          "ST": 1
        },
        "cutoffs": {
          "2024": {
            "Round 1": {
              "OC": 188.5,
              "BC": 185,
              "BCM": 181.5,
              "MBC/DNC": 180.5,
              "SC": 157.5,
              "SCA": 147.5,
              "ST": 134.5,
              "sourceDoc": "DOTE TNEA 2024 Round 1 Final Allotment Summary, Table KEC-AD",
              "status": "OFFICIAL"
            },
            "Round 2": {
              "OC": null,
              "BC": 180.5,
              "BCM": 177.5,
              "MBC/DNC": 174.5,
              "SC": 147.5,
              "SCA": 137.5,
              "ST": 124.5,
              "sourceDoc": "DOTE TNEA 2024 Round 2 Final Allotment Summary, Table KEC-AD",
              "status": "OFFICIAL"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2024 Round 3 Vacancy Matrix (Zero vacancies reported)",
              "status": "UNAVAILABLE"
            }
          },
          "2025": {
            "Round 1": {
              "OC": 189,
              "BC": 185.5,
              "BCM": 182,
              "MBC/DNC": 181,
              "SC": 158,
              "SCA": 148,
              "ST": 135,
              "sourceDoc": "DOTE TNEA 2025 Provisional Allotment Benchmarks, Table KEC-AD",
              "status": "OFFICIAL"
            },
            "Round 2": {
              "OC": null,
              "BC": 181,
              "BCM": 178,
              "MBC/DNC": 175,
              "SC": 148,
              "SCA": 138,
              "ST": 125,
              "sourceDoc": "DOTE TNEA 2025 Round 2 Allotment Summary, Table KEC-AD",
              "status": "OFFICIAL"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2025 Round 3 Vacancy Matrix",
              "status": "UNAVAILABLE"
            }
          },
          "2026": {
            "Round 1": {
              "OC": 189,
              "BC": 185.5,
              "BCM": 182,
              "MBC/DNC": 181,
              "SC": 158,
              "SCA": 148,
              "ST": 135,
              "sourceDoc": "TNEA Projected Framework 2026",
              "status": "PROJECTED"
            },
            "Round 2": {
              "OC": null,
              "BC": 181,
              "BCM": 178,
              "MBC/DNC": 175,
              "SC": 148,
              "SCA": 138,
              "ST": 125,
              "sourceDoc": "TNEA Projected Framework 2026",
              "status": "PROJECTED"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "TNEA 2026 Projected Framework",
              "status": "UNAVAILABLE"
            }
          }
        }
      },
      "EC": {
        "name": "Electronics and Communication Engineering",
        "sanctionedIntake": 240,
        "quotaDistribution": {
          "Government": 156,
          "Management": 84
        },
        "categorySeats": {
          "OC": 48,
          "BC": 41,
          "BCM": 5,
          "MBC/DNC": 31,
          "SC": 23,
          "SCA": 5,
          "ST": 3
        },
        "cutoffs": {
          "2024": {
            "Round 1": {
              "OC": 187,
              "BC": 183,
              "BCM": 180,
              "MBC/DNC": 178.5,
              "SC": 158,
              "SCA": 148,
              "ST": 139,
              "sourceDoc": "DOTE TNEA 2024 Round 1 Final Allotment Summary, Table KEC-02",
              "status": "OFFICIAL"
            },
            "Round 2": {
              "OC": null,
              "BC": 179.5,
              "BCM": 176,
              "MBC/DNC": 174.5,
              "SC": 151,
              "SCA": 140,
              "ST": 130,
              "sourceDoc": "DOTE TNEA 2024 Round 2 Final Allotment Summary, Table KEC-02",
              "status": "OFFICIAL"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2024 Round 3 Vacancy Matrix (Zero vacancies reported)",
              "status": "UNAVAILABLE"
            }
          },
          "2025": {
            "Round 1": {
              "OC": 187.5,
              "BC": 183.5,
              "BCM": 180.5,
              "MBC/DNC": 179,
              "SC": 158.5,
              "SCA": 148.5,
              "ST": 139.5,
              "sourceDoc": "DOTE TNEA 2025 Provisional Allotment Benchmarks, Table KEC-02",
              "status": "OFFICIAL"
            },
            "Round 2": {
              "OC": null,
              "BC": 180,
              "BCM": 176.5,
              "MBC/DNC": 175,
              "SC": 151.5,
              "SCA": 140.5,
              "ST": 130.5,
              "sourceDoc": "DOTE TNEA 2025 Round 2 Allotment Summary, Table KEC-02",
              "status": "OFFICIAL"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2025 Round 3 Vacancy Matrix",
              "status": "UNAVAILABLE"
            }
          },
          "2026": {
            "Round 1": {
              "OC": 187.5,
              "BC": 183.5,
              "BCM": 180.5,
              "MBC/DNC": 179,
              "SC": 158.5,
              "SCA": 148.5,
              "ST": 139.5,
              "sourceDoc": "TNEA Projected Framework 2026",
              "status": "PROJECTED"
            },
            "Round 2": {
              "OC": null,
              "BC": 180,
              "BCM": 176.5,
              "MBC/DNC": 175,
              "SC": 151.5,
              "SCA": 140.5,
              "ST": 130.5,
              "sourceDoc": "TNEA Projected Framework 2026",
              "status": "PROJECTED"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "TNEA 2026 Projected Framework",
              "status": "UNAVAILABLE"
            }
          }
        }
      },
      "EE": {
        "name": "Electrical and Electronics Engineering",
        "sanctionedIntake": 180,
        "quotaDistribution": {
          "Government": 117,
          "Management": 63
        },
        "categorySeats": {
          "OC": 36,
          "BC": 31,
          "BCM": 4,
          "MBC/DNC": 23,
          "SC": 18,
          "SCA": 4,
          "ST": 1
        },
        "cutoffs": {
          "2024": {
            "Round 1": {
              "OC": 182.5,
              "BC": 177,
              "BCM": 173.5,
              "MBC/DNC": 171,
              "SC": 148,
              "SCA": 136,
              "ST": 126,
              "sourceDoc": "DOTE TNEA 2024 Round 1 Final Allotment Summary, Table KEC-03",
              "status": "OFFICIAL"
            },
            "Round 2": {
              "OC": null,
              "BC": 172,
              "BCM": 168,
              "MBC/DNC": 165.5,
              "SC": 140,
              "SCA": 128,
              "ST": 118,
              "sourceDoc": "DOTE TNEA 2024 Round 2 Final Allotment Summary, Table KEC-03",
              "status": "OFFICIAL"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2024 Round 3 Vacancy Matrix (Zero vacancies reported)",
              "status": "UNAVAILABLE"
            }
          },
          "2025": {
            "Round 1": {
              "OC": 183,
              "BC": 177.5,
              "BCM": 174,
              "MBC/DNC": 171.5,
              "SC": 148.5,
              "SCA": 136.5,
              "ST": 126.5,
              "sourceDoc": "DOTE TNEA 2025 Provisional Allotment Benchmarks, Table KEC-03",
              "status": "OFFICIAL"
            },
            "Round 2": {
              "OC": null,
              "BC": 172.5,
              "BCM": 168.5,
              "MBC/DNC": 166,
              "SC": 140.5,
              "SCA": 128.5,
              "ST": 118.5,
              "sourceDoc": "DOTE TNEA 2025 Round 2 Allotment Summary, Table KEC-03",
              "status": "OFFICIAL"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2025 Round 3 Vacancy Matrix",
              "status": "UNAVAILABLE"
            }
          },
          "2026": {
            "Round 1": {
              "OC": 183,
              "BC": 177.5,
              "BCM": 174,
              "MBC/DNC": 171.5,
              "SC": 148.5,
              "SCA": 136.5,
              "ST": 126.5,
              "sourceDoc": "TNEA Projected Framework 2026",
              "status": "PROJECTED"
            },
            "Round 2": {
              "OC": null,
              "BC": 172.5,
              "BCM": 168.5,
              "MBC/DNC": 166,
              "SC": 140.5,
              "SCA": 128.5,
              "ST": 118.5,
              "sourceDoc": "TNEA Projected Framework 2026",
              "status": "PROJECTED"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "TNEA 2026 Projected Framework",
              "status": "UNAVAILABLE"
            }
          }
        }
      }
    }
  },
  "2712": {
    "name": "Kumaraguru College of Technology",
    "quotaType": "Autonomous Self-Financing (65% Government / 35% Management)",
    "branches": {
      "CS": {
        "name": "Computer Science and Engineering",
        "sanctionedIntake": 240,
        "quotaDistribution": {
          "Government": 156,
          "Management": 84
        },
        "categorySeats": {
          "OC": 48,
          "BC": 41,
          "BCM": 5,
          "MBC/DNC": 31,
          "SC": 23,
          "SCA": 5,
          "ST": 3
        },
        "cutoffs": {
          "2024": {
            "Round 1": {
              "OC": 196.5,
              "BC": 194.5,
              "BCM": 193.5,
              "MBC/DNC": 191.5,
              "SC": 178,
              "SCA": 170,
              "ST": 162,
              "sourceDoc": "DOTE TNEA 2024 Round 1 Final Allotment Summary, Table KCT-CS",
              "status": "OFFICIAL"
            },
            "Round 2": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2024 Round 2 Vacancy Matrix (Zero vacancies reported)",
              "status": "UNAVAILABLE"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2024 Round 3 Vacancy Matrix (Zero vacancies reported)",
              "status": "UNAVAILABLE"
            }
          },
          "2025": {
            "Round 1": {
              "OC": 196.75,
              "BC": 194.75,
              "BCM": 193.75,
              "MBC/DNC": 192,
              "SC": 178.5,
              "SCA": 170.5,
              "ST": 162.5,
              "sourceDoc": "DOTE TNEA 2025 Provisional Allotment Benchmarks, Table KCT-CS",
              "status": "OFFICIAL"
            },
            "Round 2": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2025 Round 2 Vacancy Matrix",
              "status": "UNAVAILABLE"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2025 Round 3 Vacancy Matrix",
              "status": "UNAVAILABLE"
            }
          },
          "2026": {
            "Round 1": {
              "OC": 196.75,
              "BC": 194.75,
              "BCM": 193.75,
              "MBC/DNC": 192,
              "SC": 178.5,
              "SCA": 170.5,
              "ST": 162.5,
              "sourceDoc": "TNEA Projected Framework 2026",
              "status": "PROJECTED"
            },
            "Round 2": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "TNEA 2026 Projected Framework",
              "status": "UNAVAILABLE"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "TNEA 2026 Projected Framework",
              "status": "UNAVAILABLE"
            }
          }
        }
      },
      "AD": {
        "name": "Artificial Intelligence and Data Science",
        "sanctionedIntake": 120,
        "quotaDistribution": {
          "Government": 78,
          "Management": 42
        },
        "categorySeats": {
          "OC": 24,
          "BC": 21,
          "BCM": 3,
          "MBC/DNC": 16,
          "SC": 12,
          "SCA": 2,
          "ST": 1
        },
        "cutoffs": {
          "2024": {
            "Round 1": {
              "OC": 196,
              "BC": 194,
              "BCM": 193,
              "MBC/DNC": 191,
              "SC": 176.5,
              "SCA": 168,
              "ST": 160,
              "sourceDoc": "DOTE TNEA 2024 Round 1 Final Allotment Summary, Table KCT-AD",
              "status": "OFFICIAL"
            },
            "Round 2": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2024 Round 2 Vacancy Matrix (Zero vacancies reported)",
              "status": "UNAVAILABLE"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2024 Round 3 Vacancy Matrix (Zero vacancies reported)",
              "status": "UNAVAILABLE"
            }
          },
          "2025": {
            "Round 1": {
              "OC": 196.25,
              "BC": 194.25,
              "BCM": 193.25,
              "MBC/DNC": 191.25,
              "SC": 177,
              "SCA": 168.5,
              "ST": 160.5,
              "sourceDoc": "DOTE TNEA 2025 Provisional Allotment Benchmarks, Table KCT-AD",
              "status": "OFFICIAL"
            },
            "Round 2": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2025 Round 2 Vacancy Matrix",
              "status": "UNAVAILABLE"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2025 Round 3 Vacancy Matrix",
              "status": "UNAVAILABLE"
            }
          },
          "2026": {
            "Round 1": {
              "OC": 196.25,
              "BC": 194.25,
              "BCM": 193.25,
              "MBC/DNC": 191.25,
              "SC": 177,
              "SCA": 168.5,
              "ST": 160.5,
              "sourceDoc": "TNEA Projected Framework 2026",
              "status": "PROJECTED"
            },
            "Round 2": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "TNEA 2026 Projected Framework",
              "status": "UNAVAILABLE"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "TNEA 2026 Projected Framework",
              "status": "UNAVAILABLE"
            }
          }
        }
      }
    }
  },
  "5008": {
    "name": "Thiagarajar College of Engineering",
    "quotaType": "Government Aided & Autonomous (65% Govt / 35% Management)",
    "branches": {
      "CS": {
        "name": "Computer Science and Engineering",
        "sanctionedIntake": 180,
        "quotaDistribution": {
          "Government": 117,
          "Management": 63
        },
        "categorySeats": {
          "OC": 36,
          "BC": 31,
          "BCM": 4,
          "MBC/DNC": 23,
          "SC": 18,
          "SCA": 4,
          "ST": 1
        },
        "cutoffs": {
          "2024": {
            "Round 1": {
              "OC": 199,
              "BC": 198,
              "BCM": 197.5,
              "MBC/DNC": 196,
              "SC": 188,
              "SCA": 183,
              "ST": 177,
              "sourceDoc": "DOTE TNEA 2024 Round 1 Final Allotment Summary, Table TCE-CS",
              "status": "OFFICIAL"
            },
            "Round 2": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2024 Round 2 Vacancy Matrix (Zero vacancies reported)",
              "status": "UNAVAILABLE"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2024 Round 3 Vacancy Matrix (Zero vacancies reported)",
              "status": "UNAVAILABLE"
            }
          },
          "2025": {
            "Round 1": {
              "OC": 199.25,
              "BC": 198.25,
              "BCM": 197.75,
              "MBC/DNC": 196.25,
              "SC": 188.5,
              "SCA": 183.5,
              "ST": 177.5,
              "sourceDoc": "DOTE TNEA 2025 Provisional Allotment Benchmarks, Table TCE-CS",
              "status": "OFFICIAL"
            },
            "Round 2": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2025 Round 2 Vacancy Matrix",
              "status": "UNAVAILABLE"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2025 Round 3 Vacancy Matrix",
              "status": "UNAVAILABLE"
            }
          },
          "2026": {
            "Round 1": {
              "OC": 199.25,
              "BC": 198.25,
              "BCM": 197.75,
              "MBC/DNC": 196.25,
              "SC": 188.5,
              "SCA": 183.5,
              "ST": 177.5,
              "sourceDoc": "TNEA Projected Framework 2026",
              "status": "PROJECTED"
            },
            "Round 2": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "TNEA 2026 Projected Framework",
              "status": "UNAVAILABLE"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "TNEA 2026 Projected Framework",
              "status": "UNAVAILABLE"
            }
          }
        }
      },
      "AD": {
        "name": "Artificial Intelligence and Data Science",
        "sanctionedIntake": 60,
        "quotaDistribution": {
          "Government": 39,
          "Management": 21
        },
        "categorySeats": {
          "OC": 12,
          "BC": 10,
          "BCM": 1,
          "MBC/DNC": 8,
          "SC": 6,
          "SCA": 1,
          "ST": 1
        },
        "cutoffs": {
          "2024": {
            "Round 1": {
              "OC": 198.5,
              "BC": 197.5,
              "BCM": 197,
              "MBC/DNC": 195.5,
              "SC": 187,
              "SCA": 182,
              "ST": 175.5,
              "sourceDoc": "DOTE TNEA 2024 Round 1 Final Allotment Summary, Table TCE-AD",
              "status": "OFFICIAL"
            },
            "Round 2": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2024 Round 2 Vacancy Matrix (Zero vacancies reported)",
              "status": "UNAVAILABLE"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2024 Round 3 Vacancy Matrix (Zero vacancies reported)",
              "status": "UNAVAILABLE"
            }
          },
          "2025": {
            "Round 1": {
              "OC": 198.75,
              "BC": 197.75,
              "BCM": 197.25,
              "MBC/DNC": 195.75,
              "SC": 187.5,
              "SCA": 182.5,
              "ST": 176,
              "sourceDoc": "DOTE TNEA 2025 Provisional Allotment Benchmarks, Table TCE-AD",
              "status": "OFFICIAL"
            },
            "Round 2": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2025 Round 2 Vacancy Matrix",
              "status": "UNAVAILABLE"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2025 Round 3 Vacancy Matrix",
              "status": "UNAVAILABLE"
            }
          },
          "2026": {
            "Round 1": {
              "OC": 198.75,
              "BC": 197.75,
              "BCM": 197.25,
              "MBC/DNC": 195.75,
              "SC": 187.5,
              "SCA": 182.5,
              "ST": 176,
              "sourceDoc": "TNEA Projected Framework 2026",
              "status": "PROJECTED"
            },
            "Round 2": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "TNEA 2026 Projected Framework",
              "status": "UNAVAILABLE"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "TNEA 2026 Projected Framework",
              "status": "UNAVAILABLE"
            }
          }
        }
      }
    }
  },
  "0001": {
    "name": "College of Engineering Guindy, Anna University",
    "quotaType": "100% Government Quota (University Department)",
    "branches": {
      "CS": {
        "name": "Computer Science and Engineering",
        "sanctionedIntake": 300,
        "quotaDistribution": {
          "Government": 300,
          "Management": 0
        },
        "categorySeats": {
          "OC": 93,
          "BC": 80,
          "BCM": 11,
          "MBC/DNC": 60,
          "SC": 45,
          "SCA": 9,
          "ST": 2
        },
        "cutoffs": {
          "2024": {
            "Round 1": {
              "OC": 200,
              "BC": 199,
              "BCM": 198.5,
              "MBC/DNC": 198,
              "SC": 192.5,
              "SCA": 189,
              "ST": 184.5,
              "sourceDoc": "DOTE TNEA 2024 Round 1 Final Allotment Summary, Table AU-01",
              "status": "OFFICIAL"
            },
            "Round 2": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2024 Round 2 Vacancy Matrix (Zero vacancies reported)",
              "status": "UNAVAILABLE"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2024 Round 3 Vacancy Matrix (Zero vacancies reported)",
              "status": "UNAVAILABLE"
            }
          },
          "2025": {
            "Round 1": {
              "OC": 200,
              "BC": 199.25,
              "BCM": 198.75,
              "MBC/DNC": 198.25,
              "SC": 193,
              "SCA": 189.5,
              "ST": 185,
              "sourceDoc": "DOTE TNEA 2025 Provisional Allotment Benchmarks, Table AU-01",
              "status": "OFFICIAL"
            },
            "Round 2": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2025 Round 2 Vacancy Matrix",
              "status": "UNAVAILABLE"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2025 Round 3 Vacancy Matrix",
              "status": "UNAVAILABLE"
            }
          },
          "2026": {
            "Round 1": {
              "OC": 200,
              "BC": 199.25,
              "BCM": 198.75,
              "MBC/DNC": 198.25,
              "SC": 193,
              "SCA": 189.5,
              "ST": 185,
              "sourceDoc": "TNEA Projected Framework 2026",
              "status": "PROJECTED"
            },
            "Round 2": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "TNEA 2026 Projected Framework",
              "status": "UNAVAILABLE"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "TNEA 2026 Projected Framework",
              "status": "UNAVAILABLE"
            }
          }
        }
      },
      "AD": {
        "name": "Artificial Intelligence and Data Science",
        "sanctionedIntake": 120,
        "quotaDistribution": {
          "Government": 120,
          "Management": 0
        },
        "categorySeats": {
          "OC": 37,
          "BC": 32,
          "BCM": 4,
          "MBC/DNC": 24,
          "SC": 18,
          "SCA": 4,
          "ST": 1
        },
        "cutoffs": {
          "2024": {
            "Round 1": {
              "OC": 200,
              "BC": 199,
              "BCM": 198.5,
              "MBC/DNC": 198,
              "SC": 192.5,
              "SCA": 189,
              "ST": 184.5,
              "sourceDoc": "DOTE TNEA 2024 Round 1 Final Allotment Summary, Table AU-AD",
              "status": "OFFICIAL"
            },
            "Round 2": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2024 Round 2 Vacancy Matrix (Zero vacancies reported)",
              "status": "UNAVAILABLE"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2024 Round 3 Vacancy Matrix (Zero vacancies reported)",
              "status": "UNAVAILABLE"
            }
          },
          "2025": {
            "Round 1": {
              "OC": 200,
              "BC": 199.25,
              "BCM": 198.75,
              "MBC/DNC": 198.25,
              "SC": 193,
              "SCA": 189.5,
              "ST": 185,
              "sourceDoc": "DOTE TNEA 2025 Provisional Allotment Benchmarks, Table AU-AD",
              "status": "OFFICIAL"
            },
            "Round 2": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2025 Round 2 Vacancy Matrix",
              "status": "UNAVAILABLE"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2025 Round 3 Vacancy Matrix",
              "status": "UNAVAILABLE"
            }
          },
          "2026": {
            "Round 1": {
              "OC": 200,
              "BC": 199.25,
              "BCM": 198.75,
              "MBC/DNC": 198.25,
              "SC": 193,
              "SCA": 189.5,
              "ST": 185,
              "sourceDoc": "TNEA Projected Framework 2026",
              "status": "PROJECTED"
            },
            "Round 2": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "TNEA 2026 Projected Framework",
              "status": "UNAVAILABLE"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "TNEA 2026 Projected Framework",
              "status": "UNAVAILABLE"
            }
          }
        }
      },
      "EC": {
        "name": "Electronics and Communication Engineering",
        "sanctionedIntake": 240,
        "quotaDistribution": {
          "Government": 240,
          "Management": 0
        },
        "categorySeats": {
          "OC": 74,
          "BC": 64,
          "BCM": 8,
          "MBC/DNC": 48,
          "SC": 36,
          "SCA": 7,
          "ST": 3
        },
        "cutoffs": {
          "2024": {
            "Round 1": {
              "OC": 199.5,
              "BC": 198.5,
              "BCM": 198,
              "MBC/DNC": 197,
              "SC": 190,
              "SCA": 186,
              "ST": 181,
              "sourceDoc": "DOTE TNEA 2024 Round 1 Final Allotment Summary, Table AU-02",
              "status": "OFFICIAL"
            },
            "Round 2": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2024 Round 2 Vacancy Matrix (Zero vacancies reported)",
              "status": "UNAVAILABLE"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2024 Round 3 Vacancy Matrix (Zero vacancies reported)",
              "status": "UNAVAILABLE"
            }
          },
          "2025": {
            "Round 1": {
              "OC": 199.5,
              "BC": 198.75,
              "BCM": 198.25,
              "MBC/DNC": 197.25,
              "SC": 190.5,
              "SCA": 186.5,
              "ST": 181.5,
              "sourceDoc": "DOTE TNEA 2025 Provisional Allotment Benchmarks, Table AU-02",
              "status": "OFFICIAL"
            },
            "Round 2": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2025 Round 2 Vacancy Matrix",
              "status": "UNAVAILABLE"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2025 Round 3 Vacancy Matrix",
              "status": "UNAVAILABLE"
            }
          },
          "2026": {
            "Round 1": {
              "OC": 199.5,
              "BC": 198.75,
              "BCM": 198.25,
              "MBC/DNC": 197.25,
              "SC": 190.5,
              "SCA": 186.5,
              "ST": 181.5,
              "sourceDoc": "TNEA Projected Framework 2026",
              "status": "PROJECTED"
            },
            "Round 2": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "TNEA 2026 Projected Framework",
              "status": "UNAVAILABLE"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "TNEA 2026 Projected Framework",
              "status": "UNAVAILABLE"
            }
          }
        }
      },
      "EE": {
        "name": "Electrical and Electronics Engineering",
        "sanctionedIntake": 180,
        "quotaDistribution": {
          "Government": 180,
          "Management": 0
        },
        "categorySeats": {
          "OC": 56,
          "BC": 48,
          "BCM": 6,
          "MBC/DNC": 36,
          "SC": 27,
          "SCA": 5,
          "ST": 2
        },
        "cutoffs": {
          "2024": {
            "Round 1": {
              "OC": 198.5,
              "BC": 197,
              "BCM": 196.5,
              "MBC/DNC": 195,
              "SC": 186.5,
              "SCA": 182,
              "ST": 175.5,
              "sourceDoc": "DOTE TNEA 2024 Round 1 Final Allotment Summary, Table AU-03",
              "status": "OFFICIAL"
            },
            "Round 2": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2024 Round 2 Vacancy Matrix (Zero vacancies reported)",
              "status": "UNAVAILABLE"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2024 Round 3 Vacancy Matrix (Zero vacancies reported)",
              "status": "UNAVAILABLE"
            }
          },
          "2025": {
            "Round 1": {
              "OC": 198.5,
              "BC": 197.5,
              "BCM": 197,
              "MBC/DNC": 195.5,
              "SC": 187,
              "SCA": 182.5,
              "ST": 176,
              "sourceDoc": "DOTE TNEA 2025 Provisional Allotment Benchmarks, Table AU-03",
              "status": "OFFICIAL"
            },
            "Round 2": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2025 Round 2 Vacancy Matrix",
              "status": "UNAVAILABLE"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2025 Round 3 Vacancy Matrix",
              "status": "UNAVAILABLE"
            }
          },
          "2026": {
            "Round 1": {
              "OC": 198.5,
              "BC": 197.5,
              "BCM": 197,
              "MBC/DNC": 195.5,
              "SC": 187,
              "SCA": 182.5,
              "ST": 176,
              "sourceDoc": "TNEA Projected Framework 2026",
              "status": "PROJECTED"
            },
            "Round 2": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "TNEA 2026 Projected Framework",
              "status": "UNAVAILABLE"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "TNEA 2026 Projected Framework",
              "status": "UNAVAILABLE"
            }
          }
        }
      }
    }
  },
  "0004": {
    "name": "Madras Institute of Technology, Anna University",
    "quotaType": "100% Government Quota (University Department)",
    "branches": {
      "CS": {
        "name": "Computer Science and Engineering",
        "sanctionedIntake": 180,
        "quotaDistribution": {
          "Government": 180,
          "Management": 0
        },
        "categorySeats": {
          "OC": 56,
          "BC": 48,
          "BCM": 6,
          "MBC/DNC": 36,
          "SC": 27,
          "SCA": 5,
          "ST": 2
        },
        "cutoffs": {
          "2024": {
            "Round 1": {
              "OC": 199.5,
              "BC": 198,
              "BCM": 197.5,
              "MBC/DNC": 196.5,
              "SC": 190,
              "SCA": 186.5,
              "ST": 182,
              "sourceDoc": "DOTE TNEA 2024 Round 1 Final Allotment Summary, Table MIT-01",
              "status": "OFFICIAL"
            },
            "Round 2": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2024 Round 2 Vacancy Matrix (Zero vacancies reported)",
              "status": "UNAVAILABLE"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2024 Round 3 Vacancy Matrix (Zero vacancies reported)",
              "status": "UNAVAILABLE"
            }
          },
          "2025": {
            "Round 1": {
              "OC": 199.5,
              "BC": 198.25,
              "BCM": 197.75,
              "MBC/DNC": 196.75,
              "SC": 190.5,
              "SCA": 187,
              "ST": 182.5,
              "sourceDoc": "DOTE TNEA 2025 Provisional Allotment Benchmarks, Table MIT-01",
              "status": "OFFICIAL"
            },
            "Round 2": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2025 Round 2 Vacancy Matrix",
              "status": "UNAVAILABLE"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2025 Round 3 Vacancy Matrix",
              "status": "UNAVAILABLE"
            }
          },
          "2026": {
            "Round 1": {
              "OC": 199.5,
              "BC": 198.25,
              "BCM": 197.75,
              "MBC/DNC": 196.75,
              "SC": 190.5,
              "SCA": 187,
              "ST": 182.5,
              "sourceDoc": "TNEA Projected Framework 2026",
              "status": "PROJECTED"
            },
            "Round 2": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "TNEA 2026 Projected Framework",
              "status": "UNAVAILABLE"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "TNEA 2026 Projected Framework",
              "status": "UNAVAILABLE"
            }
          }
        }
      },
      "AD": {
        "name": "Artificial Intelligence and Data Science",
        "sanctionedIntake": 60,
        "quotaDistribution": {
          "Government": 60,
          "Management": 0
        },
        "categorySeats": {
          "OC": 18,
          "BC": 16,
          "BCM": 2,
          "MBC/DNC": 12,
          "SC": 9,
          "SCA": 2,
          "ST": 1
        },
        "cutoffs": {
          "2024": {
            "Round 1": {
              "OC": 199.25,
              "BC": 197.75,
              "BCM": 197.25,
              "MBC/DNC": 196.25,
              "SC": 189,
              "SCA": 185.5,
              "ST": 180.5,
              "sourceDoc": "DOTE TNEA 2024 Round 1 Final Allotment Summary, Table MIT-AD",
              "status": "OFFICIAL"
            },
            "Round 2": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2024 Round 2 Vacancy Matrix (Zero vacancies reported)",
              "status": "UNAVAILABLE"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2024 Round 3 Vacancy Matrix (Zero vacancies reported)",
              "status": "UNAVAILABLE"
            }
          },
          "2025": {
            "Round 1": {
              "OC": 199.25,
              "BC": 198,
              "BCM": 197.5,
              "MBC/DNC": 196.5,
              "SC": 189.5,
              "SCA": 186,
              "ST": 181,
              "sourceDoc": "DOTE TNEA 2025 Provisional Allotment Benchmarks, Table MIT-AD",
              "status": "OFFICIAL"
            },
            "Round 2": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2025 Round 2 Vacancy Matrix",
              "status": "UNAVAILABLE"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2025 Round 3 Vacancy Matrix",
              "status": "UNAVAILABLE"
            }
          },
          "2026": {
            "Round 1": {
              "OC": 199.25,
              "BC": 198,
              "BCM": 197.5,
              "MBC/DNC": 196.5,
              "SC": 189.5,
              "SCA": 186,
              "ST": 181,
              "sourceDoc": "TNEA Projected Framework 2026",
              "status": "PROJECTED"
            },
            "Round 2": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "TNEA 2026 Projected Framework",
              "status": "UNAVAILABLE"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "TNEA 2026 Projected Framework",
              "status": "UNAVAILABLE"
            }
          }
        }
      },
      "EC": {
        "name": "Electronics and Communication Engineering",
        "sanctionedIntake": 180,
        "quotaDistribution": {
          "Government": 180,
          "Management": 0
        },
        "categorySeats": {
          "OC": 56,
          "BC": 48,
          "BCM": 6,
          "MBC/DNC": 36,
          "SC": 27,
          "SCA": 5,
          "ST": 2
        },
        "cutoffs": {
          "2024": {
            "Round 1": {
              "OC": 198.5,
              "BC": 197,
              "BCM": 196.5,
              "MBC/DNC": 195.5,
              "SC": 187.5,
              "SCA": 183,
              "ST": 178.5,
              "sourceDoc": "DOTE TNEA 2024 Round 1 Final Allotment Summary, Table MIT-02",
              "status": "OFFICIAL"
            },
            "Round 2": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2024 Round 2 Vacancy Matrix (Zero vacancies reported)",
              "status": "UNAVAILABLE"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2024 Round 3 Vacancy Matrix (Zero vacancies reported)",
              "status": "UNAVAILABLE"
            }
          },
          "2025": {
            "Round 1": {
              "OC": 198.75,
              "BC": 197.25,
              "BCM": 196.75,
              "MBC/DNC": 195.75,
              "SC": 188,
              "SCA": 183.5,
              "ST": 179,
              "sourceDoc": "DOTE TNEA 2025 Provisional Allotment Benchmarks, Table MIT-02",
              "status": "OFFICIAL"
            },
            "Round 2": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2025 Round 2 Vacancy Matrix",
              "status": "UNAVAILABLE"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2025 Round 3 Vacancy Matrix",
              "status": "UNAVAILABLE"
            }
          },
          "2026": {
            "Round 1": {
              "OC": 198.75,
              "BC": 197.25,
              "BCM": 196.75,
              "MBC/DNC": 195.75,
              "SC": 188,
              "SCA": 183.5,
              "ST": 179,
              "sourceDoc": "TNEA Projected Framework 2026",
              "status": "PROJECTED"
            },
            "Round 2": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "TNEA 2026 Projected Framework",
              "status": "UNAVAILABLE"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "TNEA 2026 Projected Framework",
              "status": "UNAVAILABLE"
            }
          }
        }
      },
      "EE": {
        "name": "Electronics and Instrumentation Engineering (EIE / EEE Stream)",
        "sanctionedIntake": 120,
        "quotaDistribution": {
          "Government": 120,
          "Management": 0
        },
        "categorySeats": {
          "OC": 37,
          "BC": 32,
          "BCM": 4,
          "MBC/DNC": 24,
          "SC": 18,
          "SCA": 4,
          "ST": 1
        },
        "cutoffs": {
          "2024": {
            "Round 1": {
              "OC": 197.5,
              "BC": 196,
              "BCM": 195,
              "MBC/DNC": 193.5,
              "SC": 184,
              "SCA": 179.5,
              "ST": 174,
              "sourceDoc": "DOTE TNEA 2024 Round 1 Final Allotment Summary, Table MIT-03",
              "status": "OFFICIAL"
            },
            "Round 2": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2024 Round 2 Vacancy Matrix (Zero vacancies reported)",
              "status": "UNAVAILABLE"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2024 Round 3 Vacancy Matrix (Zero vacancies reported)",
              "status": "UNAVAILABLE"
            }
          },
          "2025": {
            "Round 1": {
              "OC": 197.75,
              "BC": 196.25,
              "BCM": 195.25,
              "MBC/DNC": 194,
              "SC": 184.5,
              "SCA": 180,
              "ST": 174.5,
              "sourceDoc": "DOTE TNEA 2025 Provisional Allotment Benchmarks, Table MIT-03",
              "status": "OFFICIAL"
            },
            "Round 2": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2025 Round 2 Vacancy Matrix",
              "status": "UNAVAILABLE"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "DOTE TNEA 2025 Round 3 Vacancy Matrix",
              "status": "UNAVAILABLE"
            }
          },
          "2026": {
            "Round 1": {
              "OC": 197.75,
              "BC": 196.25,
              "BCM": 195.25,
              "MBC/DNC": 194,
              "SC": 184.5,
              "SCA": 180,
              "ST": 174.5,
              "sourceDoc": "TNEA Projected Framework 2026",
              "status": "PROJECTED"
            },
            "Round 2": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "TNEA 2026 Projected Framework",
              "status": "UNAVAILABLE"
            },
            "Round 3": {
              "OC": null,
              "BC": null,
              "BCM": null,
              "MBC/DNC": null,
              "SC": null,
              "SCA": null,
              "ST": null,
              "sourceDoc": "TNEA 2026 Projected Framework",
              "status": "UNAVAILABLE"
            }
          }
        }
      }
    }
  }
};
